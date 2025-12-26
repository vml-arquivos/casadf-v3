# 📊 Documentação - Financial Dashboard

## Visão Geral

O **Financial Dashboard** é um componente React avançado que fornece uma visão completa das finanças da imobiliária, incluindo gráficos interativos, filtros, exportação de dados e análises em tempo real.

## Localização

```
client/src/pages/admin/FinancialDashboard.tsx
```

## Funcionalidades

### 1. Cards de Resumo (KPIs)
Exibe 4 métricas principais com ícones e cores distintas:

- **Receita Total** (Verde)
  - Soma de todas as receitas dos últimos 6 meses
  - Ícone: TrendingUp
  - Cor: #10b981

- **Despesas** (Vermelho)
  - Soma de todas as despesas dos últimos 6 meses
  - Ícone: TrendingDown
  - Cor: #ef4444

- **Repasses** (Azul)
  - Soma de todos os repasses aos proprietários
  - Ícone: ArrowDownLeft
  - Cor: #3b82f6

- **Lucro Líquido** (Índigo)
  - Receita - Despesas - Repasses
  - Ícone: DollarSign
  - Cor: #6366f1

### 2. Gráficos Interativos

#### Gráfico de Barras (Receita x Repasses x Despesas)
- Comparação visual das três principais métricas
- Usa Recharts BarChart
- Tooltip com formatação de moeda
- Responsivo em diferentes tamanhos de tela

#### Gráfico de Pizza (Status das Transações)
- Distribuição de transações por status
- Cores: Verde (Pago), Amarelo (Pendente), Vermelho (Cancelado)
- Mostra quantidade de transações por status

#### Gráfico de Barras Horizontal (Categorias)
- Análise de transações por categoria
- Layout vertical para melhor legibilidade
- Ordena automaticamente por valor

### 3. Filtros Avançados

#### Filtro por Tipo
```typescript
<select value={filterType} onChange={(e) => setFilterType(e.target.value)}>
  <option value="all">Todos os Tipos</option>
  <option value="revenue">Receita</option>
  <option value="expense">Despesa</option>
  <option value="transfer">Repasse</option>
  <option value="commission">Comissão</option>
</select>
```

#### Filtro por Status
```typescript
<select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)}>
  <option value="all">Todos os Status</option>
  <option value="paid">Pago</option>
  <option value="pending">Pendente</option>
  <option value="cancelled">Cancelado</option>
</select>
```

#### Ordenação
```typescript
<select value={sortBy} onChange={(e) => setSortBy(e.target.value as 'date' | 'amount')}>
  <option value="date">Mais Recentes</option>
  <option value="amount">Maior Valor</option>
</select>
```

### 4. Tabela de Transações

Exibe todas as transações com as seguintes colunas:

| Coluna | Descrição | Tipo |
|--------|-----------|------|
| Descrição | Texto descritivo da transação | string |
| Tipo | Receita, Despesa, Repasse ou Comissão | badge com cor |
| Categoria | Categoria da transação | string |
| Valor | Valor formatado em moeda | number |
| Status | Pendente, Pago ou Cancelado | badge com ícone |
| Data | Data da transação | date |

#### Status Badges
- **Pendente**: Amarelo com ícone de relógio
- **Pago**: Verde com ícone de check
- **Cancelado**: Vermelho com ícone de alerta

### 5. Ações

#### Botão Atualizar
- Recarrega dados em tempo real
- Mostra spinner durante o carregamento
- Desabilitado enquanto carrega

#### Botão Exportar
- Exporta transações filtradas para CSV
- Nome do arquivo: `transacoes-YYYY-MM-DD.csv`
- Inclui todas as colunas da tabela

## Interfaces TypeScript

### FinancialStats
```typescript
interface FinancialStats {
  totalRevenue: number;      // em centavos
  totalExpenses: number;     // em centavos
  totalRepasses: number;     // em centavos
  netProfit: number;         // em centavos
}
```

### Transaction
```typescript
interface Transaction {
  id: number;
  type: string;              // 'revenue', 'expense', 'transfer', 'commission'
  category: string;
  amount: string;            // em centavos
  description: string;
  status: string;            // 'paid', 'pending', 'cancelled'
  createdAt: Date;
  paymentDate?: Date;
  dueDate?: Date;
}
```

## Hooks e Estado

### useState
```typescript
const [stats, setStats] = useState<FinancialStats | null>(null);
const [transactions, setTransactions] = useState<Transaction[]>([]);
const [loading, setLoading] = useState(true);
const [error, setError] = useState<string | null>(null);
const [filterType, setFilterType] = useState<string>('all');
const [filterStatus, setFilterStatus] = useState<string>('all');
const [sortBy, setSortBy] = useState<'date' | 'amount'>('date');
```

### useMemo
Otimizações para cálculos complexos:

1. **filteredTransactions**: Filtra e ordena transações
2. **categoryStats**: Calcula estatísticas por categoria
3. **transactionStatus**: Conta transações por status

## Chamadas de API (tRPC)

### getStats
```typescript
const { data: statsData, isLoading: statsLoading, refetch: refetchStats } = 
  trpc.financial.getStats.useQuery();
```

Retorna estatísticas financeiras totais.

### getRecentTransactions
```typescript
const { data: transactionsData, isLoading: transactionsLoading, refetch: refetchTransactions } = 
  trpc.financial.getRecentTransactions.useQuery({
    limit: 50,
  });
```

Retorna as últimas 50 transações.

## Funções Auxiliares

### getStatusBadge
Retorna objeto com estilos e ícone para o status:
```typescript
const statusBadge = getStatusBadge(transaction.status);
// Retorna: { bg: string, text: string, icon: React.ReactNode }
```

### getTypeLabel
Converte tipo para rótulo legível:
```typescript
getTypeLabel('revenue')  // 'Receita'
getTypeLabel('expense')  // 'Despesa'
getTypeLabel('transfer') // 'Repasse'
```

### getTypeColor
Retorna classe de cor Tailwind para o tipo:
```typescript
getTypeColor('revenue')  // 'text-green-600'
getTypeColor('expense')  // 'text-red-600'
```

### handleRefresh
Recarrega dados do backend:
```typescript
const handleRefresh = async () => {
  setLoading(true);
  await Promise.all([refetchStats(), refetchTransactions()]);
  setLoading(false);
};
```

### handleExport
Exporta transações filtradas para CSV:
```typescript
const handleExport = () => {
  // Cria CSV com dados filtrados
  // Baixa arquivo com nome: transacoes-YYYY-MM-DD.csv
};
```

## Estilos e Cores

### Paleta de Cores
- **Verde**: #10b981 (Receita)
- **Vermelho**: #ef4444 (Despesa)
- **Azul**: #3b82f6 (Repasse)
- **Índigo**: #6366f1 (Lucro)
- **Amarelo**: #f59e0b (Pendente)
- **Roxo**: #8b5cf6 (Comissão)

### Tailwind Classes
- Cards: `bg-white rounded-lg shadow p-6 border-l-4`
- Botões: `px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700`
- Tabela: `w-full text-sm border-b border-gray-200 hover:bg-gray-50`

## Responsividade

### Breakpoints
- **Mobile**: 1 coluna (grid-cols-1)
- **Tablet**: 2 colunas (md:grid-cols-2)
- **Desktop**: 4 colunas (lg:grid-cols-4)

### Gráficos
- Todos os gráficos usam `ResponsiveContainer` do Recharts
- Altura fixa em 300px para consistência

## Performance

### Otimizações
1. **useMemo** para filtros e cálculos
2. **Lazy loading** de dados
3. **Refetch** sob demanda
4. **Paginação** de transações (limite de 50)

### Carregamento
- Spinner animado durante carregamento
- Mensagens de "sem dados" quando apropriado
- Estados de erro tratados

## Exemplos de Uso

### Acessar o Dashboard
```
URL: http://localhost:5173/admin/financial
Requer: Autenticação como admin
```

### Filtrar Transações
1. Selecionar tipo no dropdown "Todos os Tipos"
2. Selecionar status no dropdown "Todos os Status"
3. Ordenar por "Mais Recentes" ou "Maior Valor"

### Exportar Dados
1. Aplicar filtros desejados
2. Clicar em "Exportar"
3. Arquivo CSV será baixado

### Atualizar Dados
1. Clicar em "Atualizar"
2. Aguardar carregamento
3. Dados serão recarregados do backend

## Dependências

```json
{
  "recharts": "^2.15.2",
  "lucide-react": "^0.453.0",
  "react": "^18.3.1",
  "typescript": "5.9.3"
}
```

## Integração com Backend

### Rotas Necessárias
```typescript
// server/routers.ts
financialRouter.getStats()              // GET /api/financial/stats
financialRouter.getRecentTransactions()  // GET /api/financial/transactions
```

### Formato de Resposta
```typescript
// getStats
{
  totalRevenue: 800000,    // R$ 8.000
  totalExpenses: 50000,    // R$ 500
  totalRepasses: 640000,   // R$ 6.400
  netProfit: 110000        // R$ 1.100
}

// getRecentTransactions
[
  {
    id: 1,
    type: 'revenue',
    category: 'aluguel',
    amount: '300000',
    description: 'Aluguel - Apartamento',
    status: 'paid',
    createdAt: '2024-12-26T10:00:00Z'
  },
  // ... mais transações
]
```

## Troubleshooting

### Gráficos Não Aparecem
- Verificar se `recharts` está instalado
- Verificar se dados estão sendo carregados
- Verificar console para erros

### Filtros Não Funcionam
- Verificar se `filterType` e `filterStatus` estão sendo atualizados
- Verificar se `useMemo` está recalculando corretamente

### Exportação Não Funciona
- Verificar permissões do navegador
- Verificar se há dados para exportar
- Verificar console para erros

## Melhorias Futuras

1. **Gráficos de Tendência**: Linha de tendência ao longo do tempo
2. **Previsões**: Usar IA para prever receitas futuras
3. **Alertas**: Notificações para transações pendentes
4. **Relatórios PDF**: Gerar relatórios em PDF
5. **Comparação de Períodos**: Comparar mês a mês
6. **Integração com Banco**: Sincronizar com extratos bancários
7. **Múltiplas Moedas**: Suporte a diferentes moedas
8. **Auditoria**: Log de alterações nas transações

## Suporte

Para dúvidas ou problemas, consulte:
- Documentação do Recharts: https://recharts.org
- Documentação do Tailwind: https://tailwindcss.com
- Documentação do tRPC: https://trpc.io

---

**Versão**: 1.0.0  
**Última Atualização**: 26 de Dezembro de 2025  
**Status**: ✅ Produção
