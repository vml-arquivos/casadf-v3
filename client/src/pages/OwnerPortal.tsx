import React, { useEffect, useState } from 'react';
import { useAuth } from '../_core/hooks/useAuth';
import { trpc } from '@/lib/trpc';
import { formatCurrency } from '@/lib/utils-types';
import { Building2, DollarSign, LogOut } from 'lucide-react';

interface OwnerProperty {
  id: number;
  title: string;
  address: string;
  rentPrice: number;
  status: string;
  mainImage: string;
}

interface OwnerTransaction {
  id: number;
  type: string;
  amount: string;
  description: string;
  status: string;
  createdAt: Date;
}

const OwnerPortal: React.FC = () => {
  const { user, logout } = useAuth();
  const [properties, setProperties] = useState<OwnerProperty[]>([]);
  const [transactions, setTransactions] = useState<OwnerTransaction[]>([]);
  const [loading, setLoading] = useState(true);

  // Buscar imóveis do proprietário
  const { data: propertiesData, isLoading: propertiesLoading } = trpc.properties.list.useQuery({
    limit: 100,
  });

  // Buscar transações do proprietário
  const { data: transactionsData, isLoading: transactionsLoading } = trpc.financial.getRecentTransactions.useQuery({
    limit: 10,
  });

  useEffect(() => {
    if (propertiesData) {
      // Filtrar apenas imóveis do proprietário logado
      const ownerProperties = propertiesData.filter(
        (prop: any) => prop.createdBy === user?.id || prop.ownerId === user?.id
      );
      setProperties(ownerProperties);
    }
    if (transactionsData) {
      setTransactions(transactionsData);
    }
    setLoading(propertiesLoading || transactionsLoading);
  }, [propertiesData, transactionsData, propertiesLoading, transactionsLoading, user?.id]);

  const handleLogout = async () => {
    await logout();
    window.location.href = '/';
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-lg text-gray-600">Carregando dados...</div>
      </div>
    );
  }

  const totalRent = properties.reduce((sum, prop) => sum + (prop.rentPrice || 0), 0);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 py-6 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Portal do Proprietário</h1>
            <p className="text-gray-600 mt-1">Bem-vindo, {user?.name}</p>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
          >
            <LogOut className="h-4 w-4" />
            Sair
          </button>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8">
        {/* Resumo */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Total de Imóveis</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">{properties.length}</p>
              </div>
              <Building2 className="h-12 w-12 text-blue-500 opacity-20" />
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Renda Mensal Potencial</p>
                <p className="text-3xl font-bold text-green-600 mt-2">
                  {formatCurrency(totalRent / 100)}
                </p>
              </div>
              <DollarSign className="h-12 w-12 text-green-500 opacity-20" />
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Imóveis Alugados</p>
                <p className="text-3xl font-bold text-indigo-600 mt-2">
                  {properties.filter(p => p.status === 'alugado').length}
                </p>
              </div>
              <Building2 className="h-12 w-12 text-indigo-500 opacity-20" />
            </div>
          </div>
        </div>

        {/* Meus Imóveis */}
        <div className="bg-white rounded-lg shadow mb-8">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-xl font-bold text-gray-900">Meus Imóveis</h2>
          </div>
          {properties.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-6">
              {properties.map((property) => (
                <div key={property.id} className="border border-gray-200 rounded-lg overflow-hidden hover:shadow-lg transition">
                  {property.mainImage && (
                    <img
                      src={property.mainImage}
                      alt={property.title}
                      className="w-full h-48 object-cover"
                    />
                  )}
                  <div className="p-4">
                    <h3 className="font-bold text-gray-900 mb-2">{property.title}</h3>
                    <p className="text-sm text-gray-600 mb-3">{property.address}</p>
                    <div className="flex justify-between items-center">
                      <span className="text-lg font-bold text-green-600">
                        {formatCurrency(property.rentPrice / 100)}
                      </span>
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        property.status === 'alugado'
                          ? 'bg-green-100 text-green-800'
                          : property.status === 'disponivel'
                          ? 'bg-blue-100 text-blue-800'
                          : 'bg-gray-100 text-gray-800'
                      }`}>
                        {property.status === 'alugado' ? 'Alugado' : property.status === 'disponivel' ? 'Disponível' : property.status}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-6 text-center text-gray-500">
              <p>Você não possui imóveis cadastrados</p>
            </div>
          )}
        </div>

        {/* Extrato */}
        <div className="bg-white rounded-lg shadow">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-xl font-bold text-gray-900">Últimas Transações</h2>
          </div>
          {transactions.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-6 py-3 text-left font-semibold text-gray-700">Descrição</th>
                    <th className="px-6 py-3 text-left font-semibold text-gray-700">Tipo</th>
                    <th className="px-6 py-3 text-right font-semibold text-gray-700">Valor</th>
                    <th className="px-6 py-3 text-left font-semibold text-gray-700">Status</th>
                    <th className="px-6 py-3 text-left font-semibold text-gray-700">Data</th>
                  </tr>
                </thead>
                <tbody>
                  {transactions.map((transaction) => (
                    <tr key={transaction.id} className="border-b border-gray-200 hover:bg-gray-50">
                      <td className="px-6 py-3 text-gray-900">{transaction.description}</td>
                      <td className="px-6 py-3 text-gray-600">
                        {transaction.type === 'revenue' ? 'Receita' : transaction.type === 'expense' ? 'Despesa' : 'Repasse'}
                      </td>
                      <td className="px-6 py-3 text-right font-semibold text-gray-900">
                        {formatCurrency(Number(transaction.amount))}
                      </td>
                      <td className="px-6 py-3">
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                          transaction.status === 'paid'
                            ? 'bg-green-100 text-green-800'
                            : transaction.status === 'pending'
                            ? 'bg-yellow-100 text-yellow-800'
                            : 'bg-red-100 text-red-800'
                        }`}>
                          {transaction.status === 'paid' ? 'Pago' : transaction.status === 'pending' ? 'Pendente' : 'Cancelado'}
                        </span>
                      </td>
                      <td className="px-6 py-3 text-gray-600">
                        {new Date(transaction.createdAt).toLocaleDateString('pt-BR')}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="p-6 text-center text-gray-500">
              <p>Nenhuma transação registrada</p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default OwnerPortal;
