import React, { useEffect, useState, useMemo } from 'react';
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  ComposedChart,
} from 'recharts';
import {
  TrendingUp,
  TrendingDown,
  DollarSign,
  ArrowUpRight,
  ArrowDownLeft,
  Filter,
  Download,
  RefreshCw,
  AlertCircle,
  CheckCircle,
  Clock,
} from 'lucide-react';
import { trpc } from '@/lib/trpc';
import { formatCurrency } from '@/lib/utils-types';

interface FinancialStats {
  totalRevenue: number;
  totalExpenses: number;
  totalRepasses: number;
  netProfit: number;
}

interface Transaction {
  id: number;
  type: string;
  category: string;
  amount: string;
  description: string;
  status: string;
  createdAt: Date;
  paymentDate?: Date;
  dueDate?: Date;
}

interface SummaryCard {
  title: string;
  value: number;
  icon: React.ReactNode;
  color: string;
  bgColor: string;
  trend?: number;
}

const FinancialDashboard: React.FC = () => {
  const [stats, setStats] = useState<FinancialStats | null>(null);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filterType, setFilterType] = useState<string>('all');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'date' | 'amount'>('date');

  // Buscar dados financeiros
  const { data: statsData, isLoading: statsLoading, refetch: refetchStats } = trpc.financial.getStats.useQuery();
  const { data: transactionsData, isLoading: transactionsLoading, refetch: refetchTransactions } = trpc.financial.getRecentTransactions.useQuery({
    limit: 50,
  });

  useEffect(() => {
    if (statsData) {
      setStats(statsData);
    }
    if (transactionsData) {
      setTransactions(transactionsData);
    }
    setLoading(statsLoading || transactionsLoading);
  }, [statsData, transactionsData, statsLoading, transactionsLoading]);

  // Filtrar e ordenar transações
  const filteredTransactions = useMemo(() => {
    let filtered = [...transactions];

    if (filterType !== 'all') {
      filtered = filtered.filter(t => t.type === filterType);
    }

    if (filterStatus !== 'all') {
      filtered = filtered.filter(t => t.status === filterStatus);
    }

    if (sortBy === 'amount') {
      filtered.sort((a, b) => Number(b.amount) - Number(a.amount));
    } else {
      filtered.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    }

    return filtered;
  }, [transactions, filterType, filterStatus, sortBy]);

  // Calcular estatísticas por categoria
  const categoryStats = useMemo(() => {
    const categories: Record<string, number> = {};
    transactions.forEach(t => {
      const category = t.category || 'Outros';
      categories[category] = (categories[category] || 0) + Number(t.amount);
    });
    return Object.entries(categories).map(([name, value]) => ({
      name,
      value: value / 100,
    }));
  }, [transactions]);

  // Calcular status das transações
  const transactionStatus = useMemo(() => {
    const status = {
      paid: 0,
      pending: 0,
      cancelled: 0,
    };
    transactions.forEach(t => {
      if (t.status === 'paid') status.paid++;
      else if (t.status === 'pending') status.pending++;
      else if (t.status === 'cancelled') status.cancelled++;
    });
    return status;
  }, [transactions]);

  // Preparar dados para o gráfico de barras
  const chartData = stats
    ? [
        {
          name: 'Financeiro',
          Receita: stats.totalRevenue / 100,
          Repasses: stats.totalRepasses / 100,
          Despesas: stats.totalExpenses / 100,
        },
      ]
    : [];

  // Cores para os gráficos
  const COLORS = ['#10b981', '#3b82f6', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899'];

  // Funções auxiliares
  const getStatusBadge = (status: string) => {
    const statusMap: Record<string, { bg: string; text: string; icon: React.ReactNode }> = {
      pending: {
        bg: 'bg-yellow-100',
        text: 'text-yellow-800',
        icon: <Clock className="w-4 h-4" />,
      },
      paid: {
        bg: 'bg-green-100',
        text: 'text-green-800',
        icon: <CheckCircle className="w-4 h-4" />,
      },
      cancelled: {
        bg: 'bg-red-100',
        text: 'text-red-800',
        icon: <AlertCircle className="w-4 h-4" />,
      },
    };
    return statusMap[status] || statusMap['pending'];
  };

  const getTypeLabel = (type: string) => {
    const typeMap: Record<string, string> = {
      revenue: 'Receita',
      expense: 'Despesa',
      transfer: 'Repasse',
      commission: 'Comissão',
    };
    return typeMap[type] || type;
  };

  const getTypeColor = (type: string) => {
    const colorMap: Record<string, string> = {
      revenue: 'text-green-600',
      expense: 'text-red-600',
      transfer: 'text-blue-600',
      commission: 'text-purple-600',
    };
    return colorMap[type] || 'text-gray-600';
  };

  const handleRefresh = async () => {
    setLoading(true);
    await Promise.all([refetchStats(), refetchTransactions()]);
    setLoading(false);
  };

  const handleExport = () => {
    // Implementar exportação para CSV
    const csv = [
      ['Descrição', 'Tipo', 'Categoria', 'Valor', 'Status', 'Data'],
      ...filteredTransactions.map(t => [
        t.description,
        getTypeLabel(t.type),
        t.category || '-',
        formatCurrency(Number(t.amount)),
        t.status,
        new Date(t.createdAt).toLocaleDateString('pt-BR'),
      ]),
    ]
      .map(row => row.join(','))
      .join('\n');

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `transacoes-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
  };

  if (loading && !stats) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-lg text-gray-600">Carregando dados financeiros...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Dashboard Financeiro</h1>
          <p className="text-gray-600 mt-1">Visão geral das finanças da imobiliária</p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={handleRefresh}
            disabled={loading}
            className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            Atualizar
          </button>
          <button
            onClick={handleExport}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            <Download className="w-4 h-4" />
            Exportar
          </button>
        </div>
      </div>

      {/* Cards de Resumo */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {/* Receita Total */}
        <div className="bg-white rounded-lg shadow p-6 border-l-4 border-green-500">
          <div className="flex justify-between items-start">
            <div>
              <h3 className="text-sm font-medium text-gray-500 uppercase">Receita Total</h3>
              <p className="text-3xl font-bold text-green-600 mt-2">
                {stats ? formatCurrency(stats.totalRevenue / 100) : 'R$ 0,00'}
              </p>
              <p className="text-xs text-gray-500 mt-2">Últimos 6 meses</p>
            </div>
            <div className="bg-green-100 p-3 rounded-lg">
              <TrendingUp className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </div>

        {/* Despesas */}
        <div className="bg-white rounded-lg shadow p-6 border-l-4 border-red-500">
          <div className="flex justify-between items-start">
            <div>
              <h3 className="text-sm font-medium text-gray-500 uppercase">Despesas</h3>
              <p className="text-3xl font-bold text-red-600 mt-2">
                {stats ? formatCurrency(stats.totalExpenses / 100) : 'R$ 0,00'}
              </p>
              <p className="text-xs text-gray-500 mt-2">Últimos 6 meses</p>
            </div>
            <div className="bg-red-100 p-3 rounded-lg">
              <TrendingDown className="w-6 h-6 text-red-600" />
            </div>
          </div>
        </div>

        {/* Repasses */}
        <div className="bg-white rounded-lg shadow p-6 border-l-4 border-blue-500">
          <div className="flex justify-between items-start">
            <div>
              <h3 className="text-sm font-medium text-gray-500 uppercase">Repasses</h3>
              <p className="text-3xl font-bold text-blue-600 mt-2">
                {stats ? formatCurrency(stats.totalRepasses / 100) : 'R$ 0,00'}
              </p>
              <p className="text-xs text-gray-500 mt-2">Últimos 6 meses</p>
            </div>
            <div className="bg-blue-100 p-3 rounded-lg">
              <ArrowDownLeft className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </div>

        {/* Lucro Líquido */}
        <div className="bg-white rounded-lg shadow p-6 border-l-4 border-indigo-500">
          <div className="flex justify-between items-start">
            <div>
              <h3 className="text-sm font-medium text-gray-500 uppercase">Lucro Líquido</h3>
              <p className={`text-3xl font-bold mt-2 ${stats && stats.netProfit > 0 ? 'text-indigo-600' : 'text-red-600'}`}>
                {stats ? formatCurrency(stats.netProfit / 100) : 'R$ 0,00'}
              </p>
              <p className="text-xs text-gray-500 mt-2">Últimos 6 meses</p>
            </div>
            <div className="bg-indigo-100 p-3 rounded-lg">
              <DollarSign className="w-6 h-6 text-indigo-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Gráficos */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        {/* Gráfico de Barras */}
        <div className="lg:col-span-2 bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Receita x Repasses x Despesas</h2>
          {chartData.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip
                  formatter={(value) => formatCurrency(value)}
                  contentStyle={{ backgroundColor: '#f3f4f6', border: 'none', borderRadius: '8px' }}
                />
                <Legend />
                <Bar dataKey="Receita" fill="#10b981" radius={[8, 8, 0, 0]} />
                <Bar dataKey="Repasses" fill="#3b82f6" radius={[8, 8, 0, 0]} />
                <Bar dataKey="Despesas" fill="#ef4444" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <p className="text-gray-500 text-center py-8">Sem dados para exibir</p>
          )}
        </div>

        {/* Gráfico de Pizza - Status */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Status das Transações</h2>
          {Object.values(transactionStatus).some(v => v > 0) ? (
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={[
                    { name: 'Pago', value: transactionStatus.paid },
                    { name: 'Pendente', value: transactionStatus.pending },
                    { name: 'Cancelado', value: transactionStatus.cancelled },
                  ]}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, value }) => `${name}: ${value}`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  <Cell fill="#10b981" />
                  <Cell fill="#f59e0b" />
                  <Cell fill="#ef4444" />
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <p className="text-gray-500 text-center py-8">Sem dados para exibir</p>
          )}
        </div>
      </div>

      {/* Gráfico de Categorias */}
      <div className="bg-white rounded-lg shadow p-6 mb-8">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Transações por Categoria</h2>
        {categoryStats.length > 0 ? (
          <ResponsiveContainer width="100%" height={300}>
            <BarChart
              data={categoryStats}
              layout="vertical"
              margin={{ top: 5, right: 30, left: 200, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis type="number" />
              <YAxis dataKey="name" type="category" width={190} />
              <Tooltip formatter={(value) => formatCurrency(value)} />
              <Bar dataKey="value" fill="#3b82f6" radius={[0, 8, 8, 0]} />
            </BarChart>
          </ResponsiveContainer>
        ) : (
          <p className="text-gray-500 text-center py-8">Sem dados para exibir</p>
        )}
      </div>

      {/* Filtros e Tabela de Transações */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold text-gray-900">Transações</h2>
          <div className="flex gap-3">
            {/* Filtro por Tipo */}
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">Todos os Tipos</option>
              <option value="revenue">Receita</option>
              <option value="expense">Despesa</option>
              <option value="transfer">Repasse</option>
              <option value="commission">Comissão</option>
            </select>

            {/* Filtro por Status */}
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">Todos os Status</option>
              <option value="paid">Pago</option>
              <option value="pending">Pendente</option>
              <option value="cancelled">Cancelado</option>
            </select>

            {/* Ordenação */}
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as 'date' | 'amount')}
              className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="date">Mais Recentes</option>
              <option value="amount">Maior Valor</option>
            </select>
          </div>
        </div>

        {/* Tabela */}
        {filteredTransactions.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-3 text-left font-semibold text-gray-700">Descrição</th>
                  <th className="px-6 py-3 text-left font-semibold text-gray-700">Tipo</th>
                  <th className="px-6 py-3 text-left font-semibold text-gray-700">Categoria</th>
                  <th className="px-6 py-3 text-right font-semibold text-gray-700">Valor</th>
                  <th className="px-6 py-3 text-left font-semibold text-gray-700">Status</th>
                  <th className="px-6 py-3 text-left font-semibold text-gray-700">Data</th>
                </tr>
              </thead>
              <tbody>
                {filteredTransactions.map((transaction) => {
                  const statusBadge = getStatusBadge(transaction.status);
                  return (
                    <tr key={transaction.id} className="border-b border-gray-200 hover:bg-gray-50 transition">
                      <td className="px-6 py-3 text-gray-900 font-medium">{transaction.description}</td>
                      <td className="px-6 py-3">
                        <span className={`font-semibold ${getTypeColor(transaction.type)}`}>
                          {getTypeLabel(transaction.type)}
                        </span>
                      </td>
                      <td className="px-6 py-3 text-gray-600">{transaction.category || '-'}</td>
                      <td className="px-6 py-3 text-right font-semibold text-gray-900">
                        {formatCurrency(Number(transaction.amount))}
                      </td>
                      <td className="px-6 py-3">
                        <span
                          className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold ${statusBadge.bg} ${statusBadge.text}`}
                        >
                          {statusBadge.icon}
                          {transaction.status === 'pending'
                            ? 'Pendente'
                            : transaction.status === 'paid'
                            ? 'Pago'
                            : 'Cancelado'}
                        </span>
                      </td>
                      <td className="px-6 py-3 text-gray-600">
                        {new Date(transaction.createdAt).toLocaleDateString('pt-BR')}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center py-12">
            <AlertCircle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500">Nenhuma transação encontrada com os filtros aplicados</p>
          </div>
        )}

        {/* Paginação Info */}
        <div className="mt-4 text-sm text-gray-600">
          Mostrando <span className="font-semibold">{filteredTransactions.length}</span> de{' '}
          <span className="font-semibold">{transactions.length}</span> transações
        </div>
      </div>
    </div>
  );
};

export default FinancialDashboard;
