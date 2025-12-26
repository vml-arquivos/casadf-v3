import { trpc } from "@/lib/trpc";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Plus, MoreVertical, Pencil, Trash2, Phone, Mail, MessageSquare } from "lucide-react";
import { useLocation } from "wouter";
import { useState } from "react";
import { toast } from "sonner";

const STAGES = [
  { id: "novo", label: "Novo", color: "bg-blue-100 text-blue-700" },
  { id: "contato_inicial", label: "Contato Inicial", color: "bg-purple-100 text-purple-700" },
  { id: "qualificado", label: "Qualificado", color: "bg-green-100 text-green-700" },
  { id: "visita_agendada", label: "Visita Agendada", color: "bg-yellow-100 text-yellow-700" },
  { id: "proposta", label: "Proposta", color: "bg-orange-100 text-orange-700" },
  { id: "fechado_ganho", label: "Fechado", color: "bg-primary/10 text-primary" },
];

export default function LeadsAdmin() {
  const [, setLocation] = useLocation();
  const [viewMode, setViewMode] = useState<"kanban" | "list">("kanban");

  const { data: allLeads, refetch } = trpc.leads.list.useQuery();
  const deleteMutation = trpc.leads.delete.useMutation({
    onSuccess: () => {
      toast.success("Lead excluído com sucesso!");
      refetch();
    },
    onError: (error) => {
      toast.error(`Erro ao excluir lead: ${error.message}`);
    },
  });

  const updateMutation = trpc.leads.update.useMutation({
    onSuccess: () => {
      toast.success("Lead atualizado com sucesso!");
      refetch();
    },
    onError: (error) => {
      toast.error(`Erro ao atualizar lead: ${error.message}`);
    },
  });

  const handleDelete = (id: number) => {
    if (confirm("Tem certeza que deseja excluir este lead?")) {
      deleteMutation.mutate({ id });
    }
  };

  const handleStageChange = (leadId: number, newStage: string) => {
    updateMutation.mutate({
      id: leadId,
      data: { stage: newStage as any },
    });
  };

  const getLeadsByStage = (stage: string) => {
    return allLeads?.filter((lead) => lead.stage === stage) || [];
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <div className="min-h-screen bg-muted/30">
      <div className="container py-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-4xl font-serif font-bold mb-2">Leads</h1>
            <p className="text-muted-foreground">
              Gerencie seus leads e pipeline de vendas
            </p>
          </div>
          <div className="flex gap-2">
            <Button
              onClick={() => setLocation("/admin/leads/new")}
            >
              <Plus className="mr-2 h-4 w-4" />
              Novo Lead
            </Button>
            <Button
              variant={viewMode === "kanban" ? "default" : "outline"}
              onClick={() => setViewMode("kanban")}
            >
              Kanban
            </Button>
            <Button
              variant={viewMode === "list" ? "default" : "outline"}
              onClick={() => setViewMode("list")}
            >
              Lista
            </Button>
          </div>
        </div>

        {viewMode === "kanban" ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
            {STAGES.map((stage) => {
              const leads = getLeadsByStage(stage.id);
              return (
                <Card key={stage.id} className="border-0 shadow-md">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm font-medium flex items-center justify-between">
                      <span>{stage.label}</span>
                      <Badge variant="secondary" className="ml-2">
                        {leads.length}
                      </Badge>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {leads.length > 0 ? (
                      leads.map((lead) => (
                        <Card
                          key={lead.id}
                          className="p-3 hover:shadow-md transition-shadow cursor-pointer"
                        >
                          <div className="flex items-start justify-between mb-2">
                            <div className="flex items-center gap-2">
                              <Avatar className="h-8 w-8">
                                <AvatarFallback className="text-xs">
                                  {getInitials(lead.name)}
                                </AvatarFallback>
                              </Avatar>
                              <div>
                                <p className="font-medium text-sm">{lead.name}</p>
                                <p className="text-xs text-muted-foreground">
                                  {lead.source}
                                </p>
                              </div>
                            </div>
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="icon" className="h-6 w-6">
                                  <MoreVertical className="h-3 w-3" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                {STAGES.map((s) => (
                                  <DropdownMenuItem
                                    key={s.id}
                                    onClick={() => handleStageChange(lead.id, s.id)}
                                  >
                                    Mover para {s.label}
                                  </DropdownMenuItem>
                                ))}
                                <DropdownMenuItem
                                  onClick={() => setLocation(`/admin/leads/edit/${lead.id}`)}
                                >
                                  <Pencil className="mr-2 h-3 w-3" />
                                  Editar
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                  onClick={() => handleDelete(lead.id)}
                                  className="text-destructive"
                                >
                                  <Trash2 className="mr-2 h-3 w-3" />
                                  Excluir
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </div>

                          <div className="space-y-1 text-xs">
                            {lead.email && (
                              <div className="flex items-center gap-1 text-muted-foreground">
                                <Mail className="h-3 w-3" />
                                <span className="truncate">{lead.email}</span>
                              </div>
                            )}
                            {lead.phone && (
                              <div className="flex items-center gap-1 text-muted-foreground">
                                <Phone className="h-3 w-3" />
                                <span>{lead.phone}</span>
                              </div>
                            )}
                            {lead.whatsapp && (
                              <div className="flex items-center gap-1 text-muted-foreground">
                                <MessageSquare className="h-3 w-3" />
                                <span>{lead.whatsapp}</span>
                              </div>
                            )}
                          </div>

                          {lead.buyerProfile && (
                            <Badge variant="outline" className="mt-2 text-xs">
                              {lead.buyerProfile.replace('_', ' ')}
                            </Badge>
                          )}
                        </Card>
                      ))
                    ) : (
                      <p className="text-center text-xs text-muted-foreground py-4">
                        Nenhum lead
                      </p>
                    )}
                  </CardContent>
                </Card>
              );
            })}
          </div>
        ) : (
          <Card className="border-0 shadow-md">
            <CardContent className="p-6">
              <p className="text-center text-muted-foreground">
                Visualização em lista em desenvolvimento
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
