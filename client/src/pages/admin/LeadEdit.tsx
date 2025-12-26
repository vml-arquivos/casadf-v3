import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useLocation, useParams } from "wouter";
import { useState, useEffect } from "react";
import { toast } from "sonner";
import { ArrowLeft, Save } from "lucide-react";
import { WhatsAppTimeline } from "@/components/WhatsAppTimeline";

export default function LeadEdit() {
  const params = useParams();
  const leadId = params.id ? parseInt(params.id) : undefined;
  const [, setLocation] = useLocation();

  const { data: lead } = trpc.leads.getById.useQuery(
    { id: leadId! },
    { enabled: !!leadId }
  );

  const createMutation = trpc.leads.create.useMutation({
    onSuccess: () => {
      toast.success("Lead criado com sucesso!");
      setLocation("/admin/leads");
    },
    onError: (error) => {
      toast.error(`Erro ao criar lead: ${error.message}`);
    },
  });

  const updateMutation = trpc.leads.update.useMutation({
    onSuccess: () => {
      toast.success("Lead atualizado com sucesso!");
      setLocation("/admin/leads");
    },
    onError: (error) => {
      toast.error(`Erro ao atualizar lead: ${error.message}`);
    },
  });

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    whatsapp: "",
    clientType: "comprador" as "comprador" | "locatario" | "proprietario",
    qualification: "nao_qualificado" as "quente" | "morno" | "frio" | "nao_qualificado",
    stage: "novo" as string,
    source: "site" as string,
    transactionInterest: "venda" as "venda" | "locacao" | "ambos",
    urgencyLevel: "media" as "baixa" | "media" | "alta" | "urgente",
    buyerProfile: "" as string,
    budgetMin: "",
    budgetMax: "",
    preferredNeighborhoods: "",
    preferredPropertyTypes: "",
    notes: "",
    tags: "",
  });

  useEffect(() => {
    if (lead) {
      setFormData({
        name: lead.name || "",
        email: lead.email || "",
        phone: lead.phone || "",
        whatsapp: lead.whatsapp || "",
        clientType: lead.clientType || "comprador",
        qualification: lead.qualification || "nao_qualificado",
        stage: lead.stage || "novo",
        source: lead.source || "site",
        transactionInterest: lead.transactionInterest || "venda",
        urgencyLevel: lead.urgencyLevel || "media",
        buyerProfile: lead.buyerProfile || "",
        budgetMin: lead.budgetMin ? String(lead.budgetMin / 100) : "",
        budgetMax: lead.budgetMax ? String(lead.budgetMax / 100) : "",
        preferredNeighborhoods: lead.preferredNeighborhoods || "",
        preferredPropertyTypes: lead.preferredPropertyTypes || "",
        notes: lead.notes || "",
        tags: lead.tags || "",
      });
    }
  }, [lead]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const data = {
      name: formData.name,
      email: formData.email || undefined,
      phone: formData.phone || undefined,
      whatsapp: formData.whatsapp || undefined,
      clientType: formData.clientType,
      qualification: formData.qualification,
      stage: formData.stage as any,
      source: formData.source as any,
      transactionInterest: formData.transactionInterest,
      urgencyLevel: formData.urgencyLevel,
      buyerProfile: (formData.buyerProfile || undefined) as any,
      budgetMin: formData.budgetMin ? Math.round(parseFloat(formData.budgetMin) * 100) : undefined,
      budgetMax: formData.budgetMax ? Math.round(parseFloat(formData.budgetMax) * 100) : undefined,
      preferredNeighborhoods: formData.preferredNeighborhoods || undefined,
      preferredPropertyTypes: formData.preferredPropertyTypes || undefined,
      notes: formData.notes || undefined,
      tags: formData.tags || undefined,
    };

    if (leadId) {
      updateMutation.mutate({ id: leadId, data });
    } else {
      createMutation.mutate(data);
    }
  };

  return (
    <div className="min-h-screen bg-muted/30 p-8">
      <div className="max-w-4xl mx-auto">
        <Button
          variant="ghost"
          onClick={() => setLocation("/admin/leads")}
          className="mb-6"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Voltar para Leads
        </Button>

        <Card>
          <CardHeader>
            <CardTitle style={{ fontFamily: "Montserrat, sans-serif" }}>
              {leadId ? "Editar Lead" : "Novo Lead"}
            </CardTitle>
            <CardDescription>
              Preencha os dados completos do cliente para qualificação e acompanhamento
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-8">
              {/* Sugestões Inteligentes */}
              {lead && (
                <Card className="bg-blue-50 border-blue-200">
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2">
                      💡 Sugestões de Ação
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2 text-sm">
                      {formData.qualification === 'quente' && (
                        <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                          <p className="font-semibold text-red-700">🔥 Cliente QUENTE - Prioridade Máxima!</p>
                          <ul className="mt-2 space-y-1 text-red-600">
                            <li>• Entrar em contato HOJE</li>
                            <li>• Agendar visita presencial o quanto antes</li>
                            <li>• Preparar propostas personalizadas</li>
                            <li>• Manter contato diário via WhatsApp</li>
                          </ul>
                        </div>
                      )}
                      {formData.qualification === 'morno' && (
                        <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                          <p className="font-semibold text-yellow-700">🌡️ Cliente MORNO - Nutrir Relacionamento</p>
                          <ul className="mt-2 space-y-1 text-yellow-600">
                            <li>• Enviar novos imóveis que correspondam ao perfil</li>
                            <li>• Fazer follow-up semanal</li>
                            <li>• Compartilhar conteúdo relevante do blog</li>
                            <li>• Convidar para eventos ou open houses</li>
                          </ul>
                        </div>
                      )}
                      {formData.qualification === 'frio' && (
                        <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
                          <p className="font-semibold text-blue-700">❄️ Cliente FRIO - Manter no Radar</p>
                          <ul className="mt-2 space-y-1 text-blue-600">
                            <li>• Adicionar à lista de newsletter</li>
                            <li>• Enviar conteúdo educativo mensalmente</li>
                            <li>• Acompanhar mudanças de perfil</li>
                            <li>• Reavaliar interesse trimestralmente</li>
                          </ul>
                        </div>
                      )}
                      {formData.buyerProfile === 'investidor' && (
                        <div className="p-3 bg-green-50 border border-green-200 rounded-lg mt-2">
                          <p className="font-semibold text-green-700">💰 Perfil: Investidor</p>
                          <ul className="mt-2 space-y-1 text-green-600">
                            <li>• Destacar ROI e potencial de valorização</li>
                            <li>• Apresentar análise de mercado e comparativos</li>
                            <li>• Oferecer portfólio de múltiplas opções</li>
                          </ul>
                        </div>
                      )}
                      {formData.buyerProfile === 'primeira_casa' && (
                        <div className="p-3 bg-purple-50 border border-purple-200 rounded-lg mt-2">
                          <p className="font-semibold text-purple-700">🏡 Perfil: Primeira Casa</p>
                          <ul className="mt-2 space-y-1 text-purple-600">
                            <li>• Explicar processo de compra passo a passo</li>
                            <li>• Auxiliar com financiamento e documentação</li>
                            <li>• Mostrar bairros com boa infraestrutura</li>
                          </ul>
                        </div>
                      )}
                      {formData.urgencyLevel === 'urgente' && (
                        <div className="p-3 bg-orange-50 border border-orange-200 rounded-lg mt-2">
                          <p className="font-semibold text-orange-700">⚡ Urgência ALTA!</p>
                          <p className="text-orange-600 mt-1">Cliente precisa de solução rápida. Priorizar atendimento e agilizar processo.</p>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Classificação e Perfil */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Classificação e Perfil</h3>             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Nome Completo *</Label>
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">E-mail</Label>
                    <Input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone">Telefone</Label>
                    <Input
                      id="phone"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="whatsapp">WhatsApp</Label>
                    <Input
                      id="whatsapp"
                      value={formData.whatsapp}
                      onChange={(e) => setFormData({ ...formData, whatsapp: e.target.value })}
                    />
                  </div>
                </div>
              </div>

              {/* Perfil do Cliente */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Perfil do Cliente</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="clientType">Tipo de Cliente *</Label>
                    <Select
                      value={formData.clientType}
                      onValueChange={(value: any) => setFormData({ ...formData, clientType: value })}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="comprador">Comprador</SelectItem>
                        <SelectItem value="locatario">Locatário</SelectItem>
                        <SelectItem value="proprietario">Proprietário</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="qualification">Qualificação *</Label>
                    <Select
                      value={formData.qualification}
                      onValueChange={(value: any) => setFormData({ ...formData, qualification: value })}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="quente">🔥 Quente</SelectItem>
                        <SelectItem value="morno">🌡️ Morno</SelectItem>
                        <SelectItem value="frio">❄️ Frio</SelectItem>
                        <SelectItem value="nao_qualificado">⚪ Não Qualificado</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="urgencyLevel">Nível de Urgência</Label>
                    <Select
                      value={formData.urgencyLevel}
                      onValueChange={(value: any) => setFormData({ ...formData, urgencyLevel: value })}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="baixa">Baixa</SelectItem>
                        <SelectItem value="media">Média</SelectItem>
                        <SelectItem value="alta">Alta</SelectItem>
                        <SelectItem value="urgente">Urgente</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="buyerProfile">Perfil de Comprador</Label>
                    <Select
                      value={formData.buyerProfile}
                      onValueChange={(value) => setFormData({ ...formData, buyerProfile: value })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione..." />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="investidor">Investidor</SelectItem>
                        <SelectItem value="primeira_casa">Primeira Casa</SelectItem>
                        <SelectItem value="upgrade">Upgrade</SelectItem>
                        <SelectItem value="curioso">Curioso</SelectItem>
                        <SelectItem value="indeciso">Indeciso</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="transactionInterest">Interesse em</Label>
                    <Select
                      value={formData.transactionInterest}
                      onValueChange={(value: any) => setFormData({ ...formData, transactionInterest: value })}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="venda">Venda</SelectItem>
                        <SelectItem value="locacao">Locação</SelectItem>
                        <SelectItem value="ambos">Ambos</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>

              {/* Origem e Estágio */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Origem e Pipeline</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="source">Origem do Lead</Label>
                    <Select
                      value={formData.source}
                      onValueChange={(value) => setFormData({ ...formData, source: value })}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="site">Site</SelectItem>
                        <SelectItem value="whatsapp">WhatsApp</SelectItem>
                        <SelectItem value="instagram">Instagram</SelectItem>
                        <SelectItem value="facebook">Facebook</SelectItem>
                        <SelectItem value="indicacao">Indicação</SelectItem>
                        <SelectItem value="portal_zap">ZAP Imóveis</SelectItem>
                        <SelectItem value="portal_vivareal">Viva Real</SelectItem>
                        <SelectItem value="portal_olx">OLX</SelectItem>
                        <SelectItem value="google">Google</SelectItem>
                        <SelectItem value="outro">Outro</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="stage">Estágio no Funil</Label>
                    <Select
                      value={formData.stage}
                      onValueChange={(value) => setFormData({ ...formData, stage: value })}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="novo">Novo</SelectItem>
                        <SelectItem value="contato_inicial">Contato Inicial</SelectItem>
                        <SelectItem value="qualificado">Qualificado</SelectItem>
                        <SelectItem value="visita_agendada">Visita Agendada</SelectItem>
                        <SelectItem value="visita_realizada">Visita Realizada</SelectItem>
                        <SelectItem value="proposta">Proposta</SelectItem>
                        <SelectItem value="negociacao">Negociação</SelectItem>
                        <SelectItem value="fechado_ganho">Fechado (Ganho)</SelectItem>
                        <SelectItem value="fechado_perdido">Fechado (Perdido)</SelectItem>
                        <SelectItem value="sem_interesse">Sem Interesse</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>

              {/* Preferências */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Preferências e Orçamento</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="budgetMin">Orçamento Mínimo (R$)</Label>
                    <Input
                      id="budgetMin"
                      type="number"
                      step="1000"
                      value={formData.budgetMin}
                      onChange={(e) => setFormData({ ...formData, budgetMin: e.target.value })}
                      placeholder="Ex: 500000"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="budgetMax">Orçamento Máximo (R$)</Label>
                    <Input
                      id="budgetMax"
                      type="number"
                      step="1000"
                      value={formData.budgetMax}
                      onChange={(e) => setFormData({ ...formData, budgetMax: e.target.value })}
                      placeholder="Ex: 1000000"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="preferredNeighborhoods">Bairros Preferidos</Label>
                  <Input
                    id="preferredNeighborhoods"
                    value={formData.preferredNeighborhoods}
                    onChange={(e) => setFormData({ ...formData, preferredNeighborhoods: e.target.value })}
                    placeholder="Ex: Asa Sul, Lago Sul, Park Way"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="preferredPropertyTypes">Tipos de Imóvel Preferidos</Label>
                  <Input
                    id="preferredPropertyTypes"
                    value={formData.preferredPropertyTypes}
                    onChange={(e) => setFormData({ ...formData, preferredPropertyTypes: e.target.value })}
                    placeholder="Ex: apartamento, cobertura, casa"
                  />
                </div>
              </div>

              {/* Notas e Tags */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Observações</h3>
                <div className="space-y-2">
                  <Label htmlFor="notes">Notas</Label>
                  <Textarea
                    id="notes"
                    value={formData.notes}
                    onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                    placeholder="Observações importantes sobre o cliente..."
                    rows={4}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="tags">Tags</Label>
                  <Input
                    id="tags"
                    value={formData.tags}
                    onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                    placeholder="Ex: vip, urgente, investidor"
                  />
                </div>
              </div>

              {/* Botões */}
              <div className="flex gap-4 justify-end pt-6 border-t">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setLocation("/admin/leads")}
                >
                  Cancelar
                </Button>
                <Button
                  type="submit"
                  disabled={createMutation.isPending || updateMutation.isPending}
                >
                  <Save className="mr-2 h-4 w-4" />
                  {leadId ? "Salvar Alterações" : "Criar Lead"}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>

        {/* Timeline WhatsApp - Apenas para leads existentes */}
        {leadId && lead && lead.phone && (
          <WhatsAppTimeline phone={lead.phone} />
        )}
      </div>
    </div>
  );
}
