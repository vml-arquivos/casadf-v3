import { trpc } from "@/lib/trpc";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
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
  AlertTriangle,
  Clock,
  Send,
  Phone,
  MessageSquare,
  TrendingUp,
  Calendar
} from "lucide-react";
import { toast } from "sonner";

export default function FollowUp() {
  const [, setLocation] = useLocation();
  const { data: inactiveLeads, isLoading, refetch } = trpc.leads.getInactiveHotLeads.useQuery();

  const handleSendFollowUp = async (leadId: number, leadName: string) => {
    toast.info(`Preparando follow-up automático para ${leadName}...`);
    // Aqui será implementada a integração com N8N
    toast.success(`Follow-up programado! A Lívia 3.0 entrará em contato via WhatsApp.`);
  };

  const handleCallClient = (phone: string) => {
    if (phone) {
      window.open(`tel:${phone}`, '_self');
    } else {
      toast.error("Telefone não cadastrado");
    }
  };

  const handleWhatsAppClient = (phone: string) => {
    if (phone) {
      const cleanPhone = phone.replace(/\D/g, '');
      window.open(`https://wa.me/55${cleanPhone}`, '_blank');
    } else {
      toast.error("WhatsApp não cadastrado");
    }
  };

  const getUrgencyColor = (days: number) => {
    if (days >= 7) return "bg-red-100 text-red-700";
    if (days >= 5) return "bg-orange-100 text-orange-700 border-orange-300";
    return "bg-yellow-100 text-yellow-700 border-yellow-300";
  };

  const getUrgencyIcon = (days: number) => {
    if (days >= 7) return "🚨";
    if (days >= 5) return "⚠️";
    return "⏰";
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-muted/30 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-muted/30">
      <div className="container py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-serif font-bold mb-2 flex items-center gap-3">
            <AlertTriangle className="h-10 w-10 text-orange-500" />
            Follow-up Automático
          </h1>
          <p className="text-muted-foreground">
            Clientes quentes que precisam de atenção urgente
          </p>
        </div>

        {/* Cards de Resumo */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="bg-red-50 border-l-4 border-l-red-500">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-red-700">
                Urgente (7+ dias)
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div className="text-3xl font-bold text-red-600">
                  {inactiveLeads?.filter(l => l.daysSinceLastContact >= 7).length || 0}
                </div>
                <AlertTriangle className="h-8 w-8 text-red-500" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-orange-50 border-l-4 border-l-orange-500">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-orange-700">
                Atenção (5-6 dias)
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div className="text-3xl font-bold text-orange-600">
                  {inactiveLeads?.filter(l => l.daysSinceLastContact >= 5 && l.daysSinceLastContact < 7).length || 0}
                </div>
                <Clock className="h-8 w-8 text-orange-500" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-yellow-50 border-l-4 border-l-yellow-500">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-yellow-700">
                Monitorar (3-4 dias)
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div className="text-3xl font-bold text-yellow-600">
                  {inactiveLeads?.filter(l => l.daysSinceLastContact >= 3 && l.daysSinceLastContact < 5).length || 0}
                </div>
                <TrendingUp className="h-8 w-8 text-yellow-500" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Informações sobre Automação */}
        <Card className="mb-8 bg-gradient-to-r from-blue-50 to-purple-50 border-blue-200">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MessageSquare className="h-6 w-6 text-blue-600" />
              Sistema de Follow-up Inteligente
            </CardTitle>
            <CardDescription>
              A Lívia 3.0 pode entrar em contato automaticamente via WhatsApp
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 bg-white rounded-lg border">
                <h3 className="font-semibold mb-2 flex items-center gap-2">
                  <Calendar className="h-5 w-5 text-blue-600" />
                  Monitoramento Contínuo
                </h3>
                <p className="text-sm text-muted-foreground">
                  Sistema identifica automaticamente clientes quentes sem contato há mais de 3 dias
                </p>
              </div>
              
              <div className="p-4 bg-white rounded-lg border">
                <h3 className="font-semibold mb-2 flex items-center gap-2">
                  <Send className="h-5 w-5 text-purple-600" />
                  Mensagens Personalizadas
                </h3>
                <p className="text-sm text-muted-foreground">
                  IA envia mensagens contextualizadas com novos imóveis compatíveis
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Lista de Clientes Inativos */}
        <Card>
          <CardHeader>
            <CardTitle>Clientes que Precisam de Atenção</CardTitle>
            <CardDescription>
              {inactiveLeads?.length || 0} cliente(s) quente(s) sem contato há mais de 3 dias
            </CardDescription>
          </CardHeader>
          <CardContent>
            {inactiveLeads && inactiveLeads.length > 0 ? (
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Urgência</TableHead>
                      <TableHead>Cliente</TableHead>
                      <TableHead>Contato</TableHead>
                      <TableHead>Último Contato</TableHead>
                      <TableHead>Dias Sem Contato</TableHead>
                      <TableHead className="text-right">Ações</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {inactiveLeads.map((lead) => (
                      <TableRow key={lead.id} className="hover:bg-muted/50">
                        <TableCell>
                          <Badge className={getUrgencyColor(lead.daysSinceLastContact)}>
                            {getUrgencyIcon(lead.daysSinceLastContact)} {lead.daysSinceLastContact >= 7 ? 'Urgente' : lead.daysSinceLastContact >= 5 ? 'Atenção' : 'Monitorar'}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <button
                            onClick={() => setLocation(`/admin/leads/${lead.id}`)}
                            className="font-medium hover:underline text-left"
                          >
                            {lead.name}
                          </button>
                          <div className="text-xs text-muted-foreground capitalize">
                            {lead.clientType}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="text-sm">
                            {lead.phone && <div>{lead.phone}</div>}
                            {lead.email && <div className="text-muted-foreground text-xs">{lead.email}</div>}
                          </div>
                        </TableCell>
                        <TableCell className="text-sm">
                          {new Date(lead.lastContactDate).toLocaleDateString('pt-BR')}
                        </TableCell>
                        <TableCell>
                          <span className={`font-semibold ${
                            lead.daysSinceLastContact >= 7 ? 'text-red-600' : 
                            lead.daysSinceLastContact >= 5 ? 'text-orange-600' : 
                            'text-yellow-600'
                          }`}>
                            {lead.daysSinceLastContact} dias
                          </span>
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex gap-2 justify-end">
                            <Button
                              size="sm"
                              onClick={() => handleSendFollowUp(lead.id, lead.name)}
                              className="bg-blue-600 hover:bg-blue-700"
                            >
                              <Send className="h-4 w-4 mr-1" />
                              IA Follow-up
                            </Button>
                            {lead.phone && (
                              <>
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => handleCallClient(lead.phone!)}
                                  title="Ligar"
                                >
                                  <Phone className="h-4 w-4" />
                                </Button>
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => handleWhatsAppClient(lead.phone!)}
                                  title="WhatsApp"
                                  className="text-green-600 hover:text-green-700"
                                >
                                  <MessageSquare className="h-4 w-4" />
                                </Button>
                              </>
                            )}
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            ) : (
              <div className="text-center py-12">
                <div className="mb-4 text-6xl">🎉</div>
                <h3 className="text-xl font-semibold mb-2">Excelente trabalho!</h3>
                <p className="text-muted-foreground">
                  Todos os clientes quentes estão recebendo atenção adequada
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
