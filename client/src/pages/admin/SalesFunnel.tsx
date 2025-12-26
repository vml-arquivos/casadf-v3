import { useState } from "react";
import {
  DndContext,
  DragEndEvent,
  DragOverlay,
  DragStartEvent,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import { SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable";
import { trpc } from "@/lib/trpc";
import { LeadCard } from "@/components/LeadCard";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Search, TrendingUp, DollarSign, Users, Target } from "lucide-react";
import { toast } from "sonner";

interface Lead {
  id: number;
  name: string;
  email: string | null;
  phone: string | null;
  whatsapp: string | null;
  stage: string;
  qualification: string | null;
  budgetMin: number | null;
  budgetMax: number | null;
  score: number | null;
  priority: string | null;
  urgencyLevel: string | null;
  preferredNeighborhoods: string | null;
  notes: string | null;
}

const STAGES = [
  { id: "new", label: "Novo", color: "bg-gray-100" },
  { id: "contacted", label: "Contatado", color: "bg-blue-100" },
  { id: "qualified", label: "Qualificado", color: "bg-purple-100" },
  { id: "negotiation", label: "Negociação", color: "bg-yellow-100" },
  { id: "converted", label: "Convertido", color: "bg-green-100" },
  { id: "lost", label: "Perdido", color: "bg-red-100" },
];

export default function SalesFunnel() {
  const [activeId, setActiveId] = useState<number | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [qualificationFilter, setQualificationFilter] = useState<string>("all");
  const [priorityFilter, setPriorityFilter] = useState<string>("all");

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    })
  );

  const { data: leads = [], refetch } = trpc.leads.list.useQuery();
  const updateStageMutation = trpc.leads.updateStage.useMutation({
    onSuccess: () => {
      refetch();
      toast.success("Lead movido com sucesso!");
    },
    onError: (error: any) => {
      toast.error("Erro ao mover lead: " + error.message);
    },
  });

  // Filter leads
  const filteredLeads = leads.filter((lead: Lead) => {
    const matchesSearch =
      lead.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      lead.email?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesQualification =
      qualificationFilter === "all" || lead.qualification === qualificationFilter;
    const matchesPriority =
      priorityFilter === "all" || lead.priority === priorityFilter;
    return matchesSearch && matchesQualification && matchesPriority;
  });

  // Group leads by stage
  const leadsByStage = STAGES.reduce((acc, stage) => {
    acc[stage.id] = filteredLeads.filter((lead: Lead) => lead.stage === stage.id);
    return acc;
  }, {} as Record<string, Lead[]>);

  // Calculate statistics
  const totalLeads = leads.length;
  const qualifiedLeads = leads.filter((l: Lead) => l.stage === "qualified").length;
  const convertedLeads = leads.filter((l: Lead) => l.stage === "converted").length;
  const conversionRate = totalLeads > 0 ? ((convertedLeads / totalLeads) * 100).toFixed(1) : "0";
  const totalValue = leads
    .filter((l: Lead) => l.stage === "negotiation" || l.stage === "converted")
    .reduce((sum: number, l: Lead) => sum + (l.budgetMax || 0), 0);

  const handleDragStart = (event: DragStartEvent) => {
    setActiveId(event.active.id as number);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    setActiveId(null);

    if (!over) return;

    const leadId = active.id as number;
    const newStage = over.id as string;

    const lead = leads.find((l: Lead) => l.id === leadId);
    if (lead && lead.stage !== newStage) {
      updateStageMutation.mutate({ leadId, stage: newStage });
    }
  };

  const activeLead = activeId ? leads.find((l: Lead) => l.id === activeId) : null;

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-[1800px] mx-auto">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Funil de Vendas
          </h1>
          <p className="text-gray-600">
            Gerencie seus leads através do funil de vendas
          </p>
        </div>

        {/* Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <Card className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Total de Leads</p>
                <p className="text-2xl font-bold text-gray-900">{totalLeads}</p>
              </div>
              <div className="p-3 bg-blue-100 rounded-lg">
                <Users className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </Card>

          <Card className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Qualificados</p>
                <p className="text-2xl font-bold text-gray-900">{qualifiedLeads}</p>
              </div>
              <div className="p-3 bg-purple-100 rounded-lg">
                <Target className="w-6 h-6 text-purple-600" />
              </div>
            </div>
          </Card>

          <Card className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Taxa de Conversão</p>
                <p className="text-2xl font-bold text-gray-900">{conversionRate}%</p>
              </div>
              <div className="p-3 bg-green-100 rounded-lg">
                <TrendingUp className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </Card>

          <Card className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Valor em Negociação</p>
                <p className="text-2xl font-bold text-gray-900">
                  {new Intl.NumberFormat("pt-BR", {
                    style: "currency",
                    currency: "BRL",
                    minimumFractionDigits: 0,
                  }).format(totalValue)}
                </p>
              </div>
              <div className="p-3 bg-yellow-100 rounded-lg">
                <DollarSign className="w-6 h-6 text-yellow-600" />
              </div>
            </div>
          </Card>
        </div>

        {/* Filters */}
        <Card className="p-4 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="Buscar por nome ou email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>

            <Select value={qualificationFilter} onValueChange={setQualificationFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Qualificação" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todas as qualificações</SelectItem>
                <SelectItem value="hot">Hot 🔥</SelectItem>
                <SelectItem value="warm">Warm 🌡️</SelectItem>
                <SelectItem value="cold">Cold ❄️</SelectItem>
              </SelectContent>
            </Select>

            <Select value={priorityFilter} onValueChange={setPriorityFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Prioridade" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todas as prioridades</SelectItem>
                <SelectItem value="high">Alta</SelectItem>
                <SelectItem value="medium">Média</SelectItem>
                <SelectItem value="low">Baixa</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </Card>

        {/* Kanban Board */}
        <DndContext
          sensors={sensors}
          onDragStart={handleDragStart}
          onDragEnd={handleDragEnd}
        >
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
            {STAGES.map((stage) => {
              const stageLeads = leadsByStage[stage.id] || [];
              return (
                <SortableContext
                  key={stage.id}
                  id={stage.id}
                  items={stageLeads.map((l) => l.id)}
                  strategy={verticalListSortingStrategy}
                >
                  <Card className={`p-4 ${stage.color} min-h-[600px]`}>
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="font-semibold text-gray-900">{stage.label}</h3>
                      <Badge variant="secondary">{stageLeads.length}</Badge>
                    </div>
                    <div className="space-y-3">
                      {stageLeads.map((lead) => (
                        <LeadCard key={lead.id} lead={lead} />
                      ))}
                    </div>
                  </Card>
                </SortableContext>
              );
            })}
          </div>

          <DragOverlay>
            {activeLead ? <LeadCard lead={activeLead} /> : null}
          </DragOverlay>
        </DndContext>
      </div>
    </div>
  );
}
