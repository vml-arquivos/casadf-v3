import React, { useState, useMemo } from 'react';
import {
  PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
} from 'recharts';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { RefreshCw, Download, CheckCircle, Clock, AlertCircle } from 'lucide-react';
import { formatCurrency } from '@/lib/utils-types';

// Dados mockados para demonstração
const mockStats = {
  totalRevenue: 430000,
  totalExpenses: 50000,
  totalRepasses: 225000,
  netProfit: 155000,
};

const mockTransactions = [
  { id: 1, type: 'revenue', category: 'Aluguel Recebido', amount: 250000, description: 'Aluguel - Apartamento Águas Claras', status: 'paid', date: '2025-12-20' },
  { id: 2, type: 'revenue', category: 'Aluguel Recebido', amount: 180000, description: 'Aluguel - Apartamento Taguatinga', status: 'paid', date: '2025-12-19' },
  { id: 3, type: 'expense', category: 'Manutenção', amount: 50000, description: 'Manutenção predial', status: 'paid', date: '2025-12-18' },
  { id: 4, type: 'transfer', category: 'Repasse Proprietário', amount: 225000, description: 'Repasse mensal', status: 'paid', date: '2025-12-17' },
  { id: 5, type: 'commission', category: 'Comissão de Venda', amount: 75000, description: 'Comissão - Mansão Lago Sul', status: 'paid', date: '2025-12-16' },
];

const chartData = [
  { name: 'Receita', value: 430000 },
  { name: 'Despesas', value: 50000 },
  { name: 'Repasses', value: 225000 },
];

const COLORS = ['#3b82f6', '#ef4444', '#10b981'];

export default function FinancialDashboardDemo() {
  const [filterType, setFilterType] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');

  const filteredTransactions = useMemo(() => {
    return mockTransactions.filter(t => {
      if (filterType !== 'all' && t.type !== filterType) return false;
      if (filterStatus !== 'all' && t.status !== filterStatus) return false;
      return true;
    });
  }, [filterType, filterStatus]);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'paid': return <CheckCircle className="w-4 h-4 text-green-600" />;
      case 'pending': return <Clock className="w-4 h-4 text-yellow-600" />;
      default: return <AlertCircle className="w-4 h-4 text-red-600" />;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'revenue': return 'text-green-600 bg-green-50';
      case 'expense': return 'text-red-600 bg-red-50';
      case 'transfer': return 'text-blue-600 bg-blue-50';
      case 'commission': return 'text-purple-600 bg-purple-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Dashboard Financeiro</h1>
        <Button variant="outline" size="sm">
          <RefreshCw className="w-4 h-4 mr-2" />
          Atualizar
        </Button>
      </div>

      {/* Cards de Resumo */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="border-l-4 border-l-green-600">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Receita Total</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{formatCurrency(mockStats.totalRevenue)}</div>
            <p className="text-xs text-gray-500 mt-1">+12% vs mês anterior</p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-red-600">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Despesas</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{formatCurrency(mockStats.totalExpenses)}</div>
            <p className="text-xs text-gray-500 mt-1">-5% vs mês anterior</p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-blue-600">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Repasses</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{formatCurrency(mockStats.totalRepasses)}</div>
            <p className="text-xs text-gray-500 mt-1">Proprietários</p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-purple-600">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Lucro Líquido</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-600">{formatCurrency(mockStats.netProfit)}</div>
            <p className="text-xs text-gray-500 mt-1">+8% vs mês anterior</p>
          </CardContent>
        </Card>
      </div>

      {/* Gráficos */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Distribuição Financeira</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie data={chartData} cx="50%" cy="50%" labelLine={false} label={({ name, value }) => `${name}: ${formatCurrency(value)}`} outerRadius={80} fill="#8884d8" dataKey="value">
                  {COLORS.map((color, index) => (
                    <Cell key={`cell-${index}`} fill={color} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => formatCurrency(value)} />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Resumo por Tipo</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">Receitas</span>
                <span className="text-lg font-bold text-green-600">{formatCurrency(430000)}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">Despesas</span>
                <span className="text-lg font-bold text-red-600">{formatCurrency(50000)}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">Repasses</span>
                <span className="text-lg font-bold text-blue-600">{formatCurrency(225000)}</span>
              </div>
              <div className="border-t pt-4 flex justify-between items-center">
                <span className="text-sm font-bold">Lucro Líquido</span>
                <span className="text-lg font-bold text-purple-600">{formatCurrency(155000)}</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filtros e Tabela */}
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle>Transações Recentes</CardTitle>
              <CardDescription>Últimas movimentações financeiras</CardDescription>
            </div>
            <Button variant="outline" size="sm">
              <Download className="w-4 h-4 mr-2" />
              Exportar CSV
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4 mb-4">
            <select value={filterType} onChange={(e) => setFilterType(e.target.value)} className="px-3 py-2 border rounded-md text-sm">
              <option value="all">Todos os Tipos</option>
              <option value="revenue">Receita</option>
              <option value="expense">Despesa</option>
              <option value="transfer">Repasse</option>
              <option value="commission">Comissão</option>
            </select>
            <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)} className="px-3 py-2 border rounded-md text-sm">
              <option value="all">Todos os Status</option>
              <option value="paid">Pago</option>
              <option value="pending">Pendente</option>
            </select>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-2 px-4">Descrição</th>
                  <th className="text-left py-2 px-4">Tipo</th>
                  <th className="text-left py-2 px-4">Valor</th>
                  <th className="text-left py-2 px-4">Status</th>
                  <th className="text-left py-2 px-4">Data</th>
                </tr>
              </thead>
              <tbody>
                {filteredTransactions.map((t) => (
                  <tr key={t.id} className="border-b hover:bg-gray-50">
                    <td className="py-3 px-4">{t.description}</td>
                    <td className="py-3 px-4">
                      <span className={`px-2 py-1 rounded text-xs font-medium ${getTypeColor(t.type)}`}>
                        {t.category}
                      </span>
                    </td>
                    <td className="py-3 px-4 font-semibold">{formatCurrency(t.amount)}</td>
                    <td className="py-3 px-4 flex items-center gap-2">
                      {getStatusIcon(t.status)}
                      <span className="capitalize text-xs">{t.status === 'paid' ? 'Pago' : 'Pendente'}</span>
                    </td>
                    <td className="py-3 px-4 text-gray-500">{t.date}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
