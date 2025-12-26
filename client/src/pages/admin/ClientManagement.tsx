import { trpc } from "@/lib/trpc";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useLocation } from "wouter";
import { 
  Flame, 
  Thermometer, 
  Snowflake, 
  Users, 
  Send, 
  Bot,
  TrendingUp,
  Clock,
  CheckCircle2
} from "lucide-react";
import { toast } from "sonner";

export default function ClientManagement() {
  const [, setLocation] = useLocation();
  const { data: leads, refetch } = trpc.leads.list.useQuery();

  // Segmentação de clientes
  const newClients = leads?.filter(lead => {
    const createdDate = new Date(lead.createdAt);
    const daysSinceCreated = Math.floor((Date.now() - createdDate.getTime()) / (1000 * 60 * 60 * 24));
    return daysSinceCreated <= 7;
  }) || [];

  const hotClients = leads?.filter(lead => lead.qualification === 'quente') || [];
  const warmClients = leads?.filter(lead => lead.qualification === 'morno') || [];
  const coldClients = leads?.filter(lead => lead.qualification === 'frio') || [];

  const handleSendProperties = async (leadId: number) => {
    try {
      const lead = leads?.find(l => l.id === leadId);
      if (!lead) {
        toast.error("Lead não encontrado");
        return;
      }

      // Buscar imóveis compatíveis
      const response = await fetch(`/api/trpc/leads.matchProperties?input=${encodeURIComponent(JSON.stringify({ leadId }))}`);
      const data = await response.json();
      const properties = data.result?.data || [];

      if (properties.length === 0) {
        toast.info(`Nenhum imóvel compatível encontrado para ${lead.name}`);
        return;
      }

      // Aqui será implementada a lógica de envio via webhook N8N
      toast.success(`${properties.length} imóveis compatíveis encontrados para ${lead.name}! Envio via WhatsApp será implementado com N8N.`);
    } catch (error) {
      toast.error("Erro ao buscar imóveis compatíveis");
    }
  };

  const handleScheduleMessage = (leadId: number) => {
    toast.info("Agendamento de mensagem será implementado com N8N");
    // Aqui será implementada a lógica de agendamento via N8N
  };

  const getQualificationBadge = (qualification: string) => {
    const variants: Record<string, { icon: any; color: string; label: string }> = {
      quente: { icon: Flame, color: "bg-red-100 text-red-700", label: "Quente" },
      morno: { icon: Thermometer, color: "bg-yellow-100 text-yellow-700", label: "Morno" },
      frio: { icon: Snowflake, color: "bg-blue-100 text-blue-700", label: "Frio" },
      nao_qualificado: { icon: Clock, color: "bg-gray-100 text-gray-700", label: "Não Qualificado" },
    };
    const variant = variants[qualification] || variants.nao_qualificado;
    const Icon = variant.icon;
    return (
      <Badge className={variant.color}>
        <Icon className="h-3 w-3 mr-1" />
        {variant.label}
      </Badge>
    );
  };

  const ClientTable = ({ clients, showActions = true }: { clients: any[], showActions?: boolean }) => (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Nome</TableHead>
            <TableHead>Contato</TableHead>
            <TableHead>Tipo</TableHead>
            <TableHead>Qualificação</TableHead>
            <TableHead>Estágio</TableHead>
            {showActions && <TableHead className="text-right">Ações IA</TableHead>}
          </TableRow>
        </TableHeader>
        <TableBody>
          {clients.length > 0 ? (
            clients.map((lead) => (
              <TableRow key={lead.id}>
                <TableCell className="font-medium">
                  <button
                    onClick={() => setLocation(`/admin/leads/${lead.id}`)}
                    className="hover:underline text-left"
                  >
                    {lead.name}
                  </button>
                </TableCell>
                <TableCell>
                  <div className="text-sm">
                    {lead.phone && <div>{lead.phone}</div>}
                    {lead.email && <div className="text-muted-foreground">{lead.email}</div>}
                  </div>
                </TableCell>
                <TableCell className="capitalize">{lead.clientType}</TableCell>
                <TableCell>{getQualificationBadge(lead.qualification)}</TableCell>
                <TableCell className="capitalize text-sm">{lead.stage?.replace('_', ' ')}</TableCell>
                {showActions && (
                  <TableCell className="text-right">
                    <div className="flex gap-2 justify-end">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleSendProperties(lead.id)}
                        title="Enviar imóveis compatíveis"
                      >
                        <Send className="h-4 w-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleScheduleMessage(lead.id)}
                        title="Programar mensagem"
                      >
                        <Clock className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                )}
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={showActions ? 6 : 5} className="text-center py-8 text-muted-foreground">
                Nenhum cliente nesta categoria
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );

  return (
    <div className="min-h-screen bg-muted/30">
      <div className="container py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-serif font-bold mb-2">Gestão Inteligente de Clientes</h1>
          <p className="text-muted-foreground">
            Segmentação automática e envio de imóveis pela IA
          </p>
        </div>

        {/* Cards de Resumo */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Clientes Novos (7 dias)
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div className="text-3xl font-bold">{newClients.length}</div>
                <Users className="h-8 w-8 text-blue-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Clientes Quentes
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div className="text-3xl font-bold text-red-600">{hotClients.length}</div>
                <Flame className="h-8 w-8 text-red-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Clientes Mornos
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div className="text-3xl font-bold text-yellow-600">{warmClients.length}</div>
                <Thermometer className="h-8 w-8 text-yellow-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Clientes Frios
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div className="text-3xl font-bold text-blue-600">{coldClients.length}</div>
                <Snowflake className="h-8 w-8 text-blue-500" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Ações Automáticas da IA */}
        <Card className="mb-8 bg-gradient-to-r from-purple-50 to-blue-50 border-purple-200">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Bot className="h-6 w-6 text-purple-600" />
              Ações Automáticas da IA (Lívia 3.0)
            </CardTitle>
            <CardDescription>
              Sistema inteligente de análise e envio de imóveis compatíveis
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-4 bg-white rounded-lg border">
                <div className="flex items-center gap-2 mb-2">
                  <TrendingUp className="h-5 w-5 text-green-600" />
                  <h3 className="font-semibold">Análise Contínua</h3>
                </div>
                <p className="text-sm text-muted-foreground">
                  IA monitora perfil dos clientes e identifica oportunidades automaticamente
                </p>
              </div>
              
              <div className="p-4 bg-white rounded-lg border">
                <div className="flex items-center gap-2 mb-2">
                  <Send className="h-5 w-5 text-blue-600" />
                  <h3 className="font-semibold">Envio Inteligente</h3>
                </div>
                <p className="text-sm text-muted-foreground">
                  Imóveis compatíveis são enviados automaticamente via WhatsApp
                </p>
              </div>
              
              <div className="p-4 bg-white rounded-lg border">
                <div className="flex items-center gap-2 mb-2">
                  <CheckCircle2 className="h-5 w-5 text-purple-600" />
                  <h3 className="font-semibold">Follow-up Automático</h3>
                </div>
                <p className="text-sm text-muted-foreground">
                  Sistema mantém contato regular e nutre relacionamento
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Tabs de Segmentação */}
        <Card>
          <CardHeader>
            <CardTitle>Base de Clientes Segmentada</CardTitle>
            <CardDescription>
              Organize e gerencie seus clientes por temperatura e status
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="new" className="w-full">
              <TabsList className="grid w-full grid-cols-5">
                <TabsTrigger value="new">
                  Novos ({newClients.length})
                </TabsTrigger>
                <TabsTrigger value="hot">
                  🔥 Quentes ({hotClients.length})
                </TabsTrigger>
                <TabsTrigger value="warm">
                  🌡️ Mornos ({warmClients.length})
                </TabsTrigger>
                <TabsTrigger value="cold">
                  ❄️ Frios ({coldClients.length})
                </TabsTrigger>
                <TabsTrigger value="all">
                  Todos ({leads?.length || 0})
                </TabsTrigger>
              </TabsList>

              <TabsContent value="new" className="mt-6">
                <ClientTable clients={newClients} />
              </TabsContent>

              <TabsContent value="hot" className="mt-6">
                <ClientTable clients={hotClients} />
              </TabsContent>

              <TabsContent value="warm" className="mt-6">
                <ClientTable clients={warmClients} />
              </TabsContent>

              <TabsContent value="cold" className="mt-6">
                <ClientTable clients={coldClients} />
              </TabsContent>

              <TabsContent value="all" className="mt-6">
                <ClientTable clients={leads || []} showActions={false} />
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
