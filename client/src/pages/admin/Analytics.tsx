import { trpc } from "@/lib/trpc";
import AdminLayout from "@/components/AdminLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  TrendingUp, 
  Users, 
  Eye, 
  MousePointerClick,
  DollarSign,
  Target,
  BarChart3,
  Calendar
} from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

export default function Analytics() {
  const { data: metrics, isLoading: metricsLoading } = trpc.analytics.getMetrics.useQuery({});
  const { data: campaigns, isLoading: campaignsLoading } = trpc.analytics.listCampaigns.useQuery();
  const { data: financial, isLoading: financialLoading } = trpc.financial.getSummary.useQuery();

  const statsCards = [
    {
      title: "Total de Eventos",
      value: metrics?.totalEvents || 0,
      icon: MousePointerClick,
      description: "Todas as interações rastreadas",
      color: "text-blue-600",
    },
    {
      title: "Visualizações de Imóveis",
      value: metrics?.eventsByType?.property_view || 0,
      icon: Eye,
      description: "Imóveis visualizados",
      color: "text-green-600",
    },
    {
      title: "Contatos Recebidos",
      value: metrics?.eventsByType?.contact_form || 0,
      icon: Users,
      description: "Formulários enviados",
      color: "text-purple-600",
    },
    {
      title: "Cliques WhatsApp",
      value: metrics?.eventsByType?.whatsapp_click || 0,
      icon: Target,
      description: "Interesse direto",
      color: "text-emerald-600",
    },
  ];

  const financialCards = [
    {
      title: "Receita Total",
      value: `R$ ${(financial?.totalRevenue || 0).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`,
      icon: DollarSign,
      description: "Receitas confirmadas",
      color: "text-green-600",
    },
    {
      title: "Comissões Pagas",
      value: `R$ ${(financial?.totalCommissions || 0).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`,
      icon: TrendingUp,
      description: "Comissões recebidas",
      color: "text-blue-600",
    },
    {
      title: "Comissões Pendentes",
      value: `R$ ${(financial?.pendingCommissions || 0).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`,
      icon: Calendar,
      description: "Aguardando pagamento",
      color: "text-orange-600",
    },
    {
      title: "Lucro Líquido",
      value: `R$ ${(financial?.netProfit || 0).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`,
      icon: BarChart3,
      description: "Receita - Despesas",
      color: "text-purple-600",
    },
  ];

  return (
    <AdminLayout>
      <div className="space-y-8">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold">Analytics & Métricas</h1>
          <p className="text-muted-foreground mt-2">
            Acompanhe o desempenho do seu site e campanhas em tempo real
          </p>
        </div>

        {/* Métricas de Tráfego */}
        <div>
          <h2 className="text-xl font-semibold mb-4">Métricas de Tráfego</h2>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {metricsLoading ? (
              <>
                {[1, 2, 3, 4].map((i) => (
                  <Card key={i}>
                    <CardHeader className="pb-2">
                      <Skeleton className="h-4 w-24" />
                    </CardHeader>
                    <CardContent>
                      <Skeleton className="h-8 w-16 mb-2" />
                      <Skeleton className="h-3 w-32" />
                    </CardContent>
                  </Card>
                ))}
              </>
            ) : (
              statsCards.map((stat, index) => (
                <Card key={index}>
                  <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <CardTitle className="text-sm font-medium text-muted-foreground">
                      {stat.title}
                    </CardTitle>
                    <stat.icon className={`h-5 w-5 ${stat.color}`} />
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold">{stat.value}</div>
                    <p className="text-xs text-muted-foreground mt-1">
                      {stat.description}
                    </p>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </div>

        {/* Métricas Financeiras */}
        <div>
          <h2 className="text-xl font-semibold mb-4">Resumo Financeiro</h2>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {financialLoading ? (
              <>
                {[1, 2, 3, 4].map((i) => (
                  <Card key={i}>
                    <CardHeader className="pb-2">
                      <Skeleton className="h-4 w-24" />
                    </CardHeader>
                    <CardContent>
                      <Skeleton className="h-8 w-32 mb-2" />
                      <Skeleton className="h-3 w-28" />
                    </CardContent>
                  </Card>
                ))}
              </>
            ) : (
              financialCards.map((stat, index) => (
                <Card key={index}>
                  <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <CardTitle className="text-sm font-medium text-muted-foreground">
                      {stat.title}
                    </CardTitle>
                    <stat.icon className={`h-5 w-5 ${stat.color}`} />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{stat.value}</div>
                    <p className="text-xs text-muted-foreground mt-1">
                      {stat.description}
                    </p>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </div>

        {/* Fontes de Tráfego */}
        <div className="grid gap-6 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Fontes de Tráfego</CardTitle>
              <CardDescription>De onde vêm seus visitantes</CardDescription>
            </CardHeader>
            <CardContent>
              {metricsLoading ? (
                <div className="space-y-3">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="flex items-center justify-between">
                      <Skeleton className="h-4 w-24" />
                      <Skeleton className="h-4 w-12" />
                    </div>
                  ))}
                </div>
              ) : metrics?.eventsBySource && Object.keys(metrics.eventsBySource).length > 0 ? (
                <div className="space-y-3">
                  {Object.entries(metrics.eventsBySource).map(([source, count]) => (
                    <div key={source} className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-primary" />
                        <span className="font-medium capitalize">{source || 'Direto'}</span>
                      </div>
                      <span className="text-muted-foreground">{count} eventos</span>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-muted-foreground">
                  Nenhum dado de tráfego ainda. Os eventos começarão a aparecer quando houver visitantes.
                </p>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Tipos de Eventos</CardTitle>
              <CardDescription>Ações realizadas pelos visitantes</CardDescription>
            </CardHeader>
            <CardContent>
              {metricsLoading ? (
                <div className="space-y-3">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="flex items-center justify-between">
                      <Skeleton className="h-4 w-32" />
                      <Skeleton className="h-4 w-12" />
                    </div>
                  ))}
                </div>
              ) : metrics?.eventsByType && Object.keys(metrics.eventsByType).length > 0 ? (
                <div className="space-y-3">
                  {Object.entries(metrics.eventsByType).map(([type, count]) => {
                    const eventNames: Record<string, string> = {
                      page_view: 'Visualizações de Página',
                      property_view: 'Visualizações de Imóvel',
                      contact_form: 'Formulários de Contato',
                      whatsapp_click: 'Cliques no WhatsApp',
                      phone_click: 'Cliques no Telefone',
                    };
                    
                    return (
                      <div key={type} className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div className="w-2 h-2 rounded-full bg-primary" />
                          <span className="font-medium">{eventNames[type] || type}</span>
                        </div>
                        <span className="text-muted-foreground">{count}</span>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <p className="text-sm text-muted-foreground">
                  Nenhum evento registrado ainda. Comece a navegar no site para gerar dados.
                </p>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Campanhas Ativas */}
        <Card>
          <CardHeader>
            <CardTitle>Campanhas de Marketing</CardTitle>
            <CardDescription>Acompanhe o desempenho das suas campanhas</CardDescription>
          </CardHeader>
          <CardContent>
            {campaignsLoading ? (
              <div className="space-y-4">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="border rounded-lg p-4">
                    <Skeleton className="h-5 w-48 mb-2" />
                    <Skeleton className="h-4 w-32" />
                  </div>
                ))}
              </div>
            ) : campaigns && campaigns.length > 0 ? (
              <div className="space-y-4">
                {campaigns.slice(0, 5).map((campaign) => (
                  <div key={campaign.id} className="border rounded-lg p-4">
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="font-semibold">{campaign.name}</h3>
                        <p className="text-sm text-muted-foreground">
                          {campaign.source} • {campaign.medium || 'N/A'}
                        </p>
                      </div>
                      <div className="text-right">
                        <div className="text-sm font-medium">{campaign.conversions} conversões</div>
                        <div className="text-xs text-muted-foreground">
                          {campaign.budget ? `R$ ${Number(campaign.budget).toLocaleString('pt-BR')}` : 'Sem orçamento'}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">
                Nenhuma campanha cadastrada. Crie campanhas para rastrear o ROI dos seus investimentos em marketing.
              </p>
            )}
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
}
