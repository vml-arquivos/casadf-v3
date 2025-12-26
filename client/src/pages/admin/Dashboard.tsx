import { trpc } from "@/lib/trpc";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  Building2, 
  Users, 
  TrendingUp, 
  DollarSign,
  Target,
  Flame,
  Snowflake,
  ThermometerSun,
  Activity,
  ShoppingCart,
  Home as HomeIcon,
  Key,
  AlertTriangle,
  ArrowRight
} from "lucide-react";
import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";

export default function Dashboard() {
  const [, setLocation] = useLocation();
  const { data: properties } = trpc.properties.list.useQuery();
  const { data: leads } = trpc.leads.list.useQuery();
  const { data: inactiveLeads } = trpc.leads.getInactiveHotLeads.useQuery();

  // Estatísticas gerais
  const totalProperties = properties?.length || 0;
  const totalLeads = leads?.length || 0;
  const activeProperties = properties?.filter(p => p.status === 'disponivel').length || 0;
  const hotLeads = leads?.filter(l => l.qualification === 'quente').length || 0;

  // Análise por tipo de cliente
  const leadsByClientType = leads?.reduce((acc, lead) => {
    const type = lead.clientType || 'comprador';
    acc[type] = (acc[type] || 0) + 1;
    return acc;
  }, {} as Record<string, number>) || {};

  // Análise por qualificação
  const leadsByQualification = leads?.reduce((acc, lead) => {
    const qual = lead.qualification || 'nao_qualificado';
    acc[qual] = (acc[qual] || 0) + 1;
    return acc;
  }, {} as Record<string, number>) || {};

  // Análise por estágio
  const leadsByStage = leads?.reduce((acc, lead) => {
    acc[lead.stage] = (acc[lead.stage] || 0) + 1;
    return acc;
  }, {} as Record<string, number>) || {};

  // Análise por origem
  const leadsBySource = leads?.reduce((acc, lead) => {
    const source = lead.source || 'site';
    acc[source] = (acc[source] || 0) + 1;
    return acc;
  }, {} as Record<string, number>) || {};

  // Leads recentes
  const recentLeads = leads?.slice(0, 5) || [];

  // Valor total de imóveis disponíveis
  const totalPropertyValue = properties
    ?.filter(p => p.status === 'disponivel')
    .reduce((sum, p) => sum + (p.salePrice || 0), 0) || 0;

  // Configurações de visualização
  const clientTypeConfig = {
    comprador: { label: "Compradores", icon: ShoppingCart, color: "text-green-600", bg: "bg-green-50" },
    locatario: { label: "Locatários", icon: HomeIcon, color: "text-blue-600", bg: "bg-blue-50" },
    proprietario: { label: "Proprietários", icon: Key, color: "text-purple-600", bg: "bg-purple-50" },
  };

  const qualificationConfig = {
    quente: { label: "Quente", icon: Flame, color: "text-red-600", bg: "bg-red-50" },
    morno: { label: "Morno", icon: ThermometerSun, color: "text-orange-600", bg: "bg-orange-50" },
    frio: { label: "Frio", icon: Snowflake, color: "text-blue-600", bg: "bg-blue-50" },
    nao_qualificado: { label: "Não Qualificado", icon: Activity, color: "text-gray-600", bg: "bg-gray-50" },
  };

  const stageLabels: Record<string, string> = {
    novo: "Novo",
    contato_inicial: "Contato Inicial",
    qualificado: "Qualificado",
    visita_agendada: "Visita Agendada",
    visita_realizada: "Visita Realizada",
    proposta: "Proposta",
    negociacao: "Negociação",
    fechado_ganho: "Fechado (Ganho)",
    fechado_perdido: "Fechado (Perdido)",
    sem_interesse: "Sem Interesse",
  };

  const sourceLabels: Record<string, string> = {
    site: "Site",
    whatsapp: "WhatsApp",
    instagram: "Instagram",
    facebook: "Facebook",
    indicacao: "Indicação",
    portal_zap: "ZAP Imóveis",
    portal_vivareal: "Viva Real",
    portal_olx: "OLX",
    google: "Google",
    outro: "Outro",
  };

  return (
    <div className="space-y-8 p-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight" style={{ fontFamily: "Montserrat, sans-serif" }}>
          Dashboard CRM
        </h1>
        <p className="text-muted-foreground mt-2">
          Visão geral completa do funil de vendas e análise inteligente de clientes
        </p>
      </div>

      {/* Alerta de Follow-up */}
      {inactiveLeads && inactiveLeads.length > 0 && (
        <Card className="bg-gradient-to-r from-red-50 to-orange-50 border-l-4 border-l-red-500">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-red-700">
              <AlertTriangle className="h-6 w-6" />
              Atenção: Clientes Quentes Precisam de Follow-up!
            </CardTitle>
            <CardDescription>
              {inactiveLeads.length} cliente(s) quente(s) sem contato há mais de 3 dias
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground mb-2">
                  Clientes com alta probabilidade de conversão estão sem atenção. Ação imediata recomendada.
                </p>
                <div className="flex gap-4 text-sm">
                  <span className="text-red-600 font-semibold">
                    🚨 {inactiveLeads.filter(l => l.daysSinceLastContact >= 7).length} Urgente (7+ dias)
                  </span>
                  <span className="text-orange-600 font-semibold">
                    ⚠️ {inactiveLeads.filter(l => l.daysSinceLastContact >= 5 && l.daysSinceLastContact < 7).length} Atenção (5-6 dias)
                  </span>
                  <span className="text-yellow-600 font-semibold">
                    ⏰ {inactiveLeads.filter(l => l.daysSinceLastContact >= 3 && l.daysSinceLastContact < 5).length} Monitorar (3-4 dias)
                  </span>
                </div>
              </div>
              <Button 
                onClick={() => setLocation('/admin/followup')}
                className="bg-red-600 hover:bg-red-700"
              >
                Ver Clientes
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Cards de Estatísticas Principais */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total de Imóveis</CardTitle>
            <Building2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalProperties}</div>
            <p className="text-xs text-muted-foreground">
              {activeProperties} disponíveis
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total de Leads</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalLeads}</div>
            <p className="text-xs text-muted-foreground">
              {hotLeads} leads quentes
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Valor em Carteira</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              R$ {(totalPropertyValue / 100).toLocaleString('pt-BR', { minimumFractionDigits: 0 })}
            </div>
            <p className="text-xs text-muted-foreground">
              Imóveis disponíveis
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Taxa de Conversão</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {totalLeads > 0 ? (((leadsByStage['fechado_ganho'] || 0) / totalLeads) * 100).toFixed(1) : 0}%
            </div>
            <p className="text-xs text-muted-foreground">
              {leadsByStage['fechado_ganho'] || 0} fechados
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Análise de Clientes */}
      <div className="grid gap-4 md:grid-cols-2">
        {/* Análise por Tipo de Cliente */}
        <Card>
          <CardHeader>
            <CardTitle>Perfil de Clientes</CardTitle>
            <CardDescription>Distribuição por tipo de cliente</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {Object.entries(clientTypeConfig).map(([type, config]) => {
              const count = leadsByClientType[type] || 0;
              const Icon = config.icon;
              const percentage = totalLeads > 0 ? (count / totalLeads) * 100 : 0;
              
              return (
                <div key={type} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-lg ${config.bg}`}>
                      <Icon className={`h-4 w-4 ${config.color}`} />
                    </div>
                    <span className="font-medium">{config.label}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-2xl font-bold">{count}</span>
                    <span className="text-sm text-muted-foreground">
                      ({percentage.toFixed(0)}%)
                    </span>
                  </div>
                </div>
              );
            })}
            {totalLeads === 0 && (
              <p className="text-sm text-muted-foreground text-center py-4">
                Nenhum lead cadastrado ainda
              </p>
            )}
          </CardContent>
        </Card>

        {/* Análise por Qualificação */}
        <Card>
          <CardHeader>
            <CardTitle>Qualificação de Leads</CardTitle>
            <CardDescription>Temperatura e potencial de conversão</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {Object.entries(qualificationConfig).map(([qual, config]) => {
              const count = leadsByQualification[qual] || 0;
              const Icon = config.icon;
              const percentage = totalLeads > 0 ? (count / totalLeads) * 100 : 0;
              
              return (
                <div key={qual} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-lg ${config.bg}`}>
                      <Icon className={`h-4 w-4 ${config.color}`} />
                    </div>
                    <span className="font-medium">{config.label}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-2xl font-bold">{count}</span>
                    <span className="text-sm text-muted-foreground">
                      ({percentage.toFixed(0)}%)
                    </span>
                  </div>
                </div>
              );
            })}
            {totalLeads === 0 && (
              <p className="text-sm text-muted-foreground text-center py-4">
                Nenhum lead cadastrado ainda
              </p>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Funil de Vendas */}
      <Card>
        <CardHeader>
          <CardTitle>Funil de Vendas</CardTitle>
          <CardDescription>Distribuição de leads por estágio do pipeline</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            {Object.entries(leadsByStage)
              .filter(([stage]) => !['fechado_perdido', 'sem_interesse'].includes(stage))
              .map(([stage, count]) => (
                <div key={stage} className="text-center p-4 border rounded-lg hover:shadow-md transition-shadow">
                  <div className="text-3xl font-bold text-primary">{count}</div>
                  <div className="text-xs text-muted-foreground mt-1">
                    {stageLabels[stage] || stage}
                  </div>
                </div>
              ))}
          </div>
        </CardContent>
      </Card>

      {/* Origem dos Leads */}
      <Card>
        <CardHeader>
          <CardTitle>Origem dos Leads</CardTitle>
          <CardDescription>De onde vêm seus clientes potenciais</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            {Object.entries(leadsBySource)
              .sort(([, a], [, b]) => (b as number) - (a as number))
              .slice(0, 5)
              .map(([source, count]) => (
                <div key={source} className="text-center p-4 border rounded-lg">
                  <div className="text-2xl font-bold">{count as number}</div>
                  <div className="text-xs text-muted-foreground mt-1">
                    {sourceLabels[source] || source}
                  </div>
                </div>
              ))}
          </div>
        </CardContent>
      </Card>

      {/* Leads Recentes */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Leads Recentes</CardTitle>
            <CardDescription>Últimos leads cadastrados no sistema</CardDescription>
          </div>
          <Link href="/admin/leads">
            <Button variant="outline" size="sm">Ver Todos</Button>
          </Link>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {recentLeads.map((lead) => {
              const qualConfig = qualificationConfig[lead.qualification as keyof typeof qualificationConfig];
              const QualIcon = qualConfig?.icon || Activity;
              const clientConfig = clientTypeConfig[lead.clientType as keyof typeof clientTypeConfig];
              
              return (
                <div key={lead.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors">
                  <div className="flex items-center gap-4">
                    <div className={`p-2 rounded-lg ${qualConfig?.bg || 'bg-gray-50'}`}>
                      <QualIcon className={`h-5 w-5 ${qualConfig?.color || 'text-gray-600'}`} />
                    </div>
                    <div>
                      <div className="font-medium">{lead.name}</div>
                      <div className="text-sm text-muted-foreground">{lead.email}</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="text-xs px-2 py-1 rounded bg-muted">
                      {clientConfig?.label || lead.clientType}
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-medium">{qualConfig?.label || lead.qualification}</div>
                      <div className="text-xs text-muted-foreground">{stageLabels[lead.stage]}</div>
                    </div>
                  </div>
                </div>
              );
            })}
            {recentLeads.length === 0 && (
              <p className="text-sm text-muted-foreground text-center py-8">
                Nenhum lead cadastrado ainda
              </p>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Ações Rápidas */}
      <div className="grid gap-4 md:grid-cols-2">
        <Link href="/admin/properties">
          <Card className="hover:shadow-lg transition-shadow cursor-pointer">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Building2 className="h-5 w-5" />
                Gerenciar Imóveis
              </CardTitle>
              <CardDescription>
                Adicionar, editar ou remover imóveis do portfólio
              </CardDescription>
            </CardHeader>
          </Card>
        </Link>

        <Link href="/admin/leads">
          <Card className="hover:shadow-lg transition-shadow cursor-pointer">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="h-5 w-5" />
                Gerenciar Leads
              </CardTitle>
              <CardDescription>
                Acompanhar e qualificar leads no pipeline de vendas
              </CardDescription>
            </CardHeader>
          </Card>
        </Link>
      </div>
    </div>
  );
}
