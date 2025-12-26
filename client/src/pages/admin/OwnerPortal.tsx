import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Building2, DollarSign, Calendar, MapPin, Home, TrendingUp } from 'lucide-react';
import { formatCurrency } from '@/lib/utils-types';

// Dados mockados para demonstração
const mockOwnerProperties = [
  {
    id: 1,
    title: 'Apartamento Águas Claras - Aluguel',
    address: 'Águas Claras, Brasília - DF',
    rentAmount: 250000,
    status: 'alugado',
    tenant: 'João Silva',
    image: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=400',
  },
  {
    id: 2,
    title: 'Apartamento Taguatinga - Aluguel',
    address: 'Taguatinga, Brasília - DF',
    rentAmount: 180000,
    status: 'alugado',
    tenant: 'Maria Santos',
    image: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=400',
  },
];

const mockTransactions = [
  { id: 1, date: '2025-12-20', description: 'Aluguel Recebido', amount: 250000, type: 'income' },
  { id: 2, date: '2025-12-20', description: 'Taxa Administrativa', amount: -25000, type: 'expense' },
  { id: 3, date: '2025-12-20', description: 'Repasse ao Proprietário', amount: 225000, type: 'transfer' },
  { id: 4, date: '2025-12-10', description: 'Aluguel Recebido', amount: 180000, type: 'income' },
  { id: 5, date: '2025-12-10', description: 'Taxa Administrativa', amount: -18000, type: 'expense' },
];

export default function OwnerPortal() {
  const [selectedProperty, setSelectedProperty] = useState(mockOwnerProperties[0]);

  const totalRent = useMemo(() => {
    return mockOwnerProperties.reduce((sum, prop) => sum + prop.rentAmount, 0);
  }, []);

  const totalReceived = useMemo(() => {
    return mockTransactions
      .filter(t => t.type === 'income')
      .reduce((sum, t) => sum + t.amount, 0);
  }, []);

  const totalExpenses = useMemo(() => {
    return Math.abs(mockTransactions
      .filter(t => t.type === 'expense')
      .reduce((sum, t) => sum + t.amount, 0));
  }, []);

  const totalTransferred = useMemo(() => {
    return mockTransactions
      .filter(t => t.type === 'transfer')
      .reduce((sum, t) => sum + t.amount, 0);
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'alugado': return 'bg-green-100 text-green-800';
      case 'disponivel': return 'bg-blue-100 text-blue-800';
      case 'reservado': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getTransactionColor = (type: string) => {
    switch (type) {
      case 'income': return 'text-green-600';
      case 'expense': return 'text-red-600';
      case 'transfer': return 'text-blue-600';
      default: return 'text-gray-600';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Portal do Proprietário</h1>
        <Button variant="outline">
          <Calendar className="w-4 h-4 mr-2" />
          Período
        </Button>
      </div>

      {/* Cards de Resumo */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Aluguel Total</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{formatCurrency(totalRent)}</div>
            <p className="text-xs text-gray-500 mt-1">Valor mensal</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Recebido</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{formatCurrency(totalReceived)}</div>
            <p className="text-xs text-gray-500 mt-1">Neste período</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Despesas</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{formatCurrency(totalExpenses)}</div>
            <p className="text-xs text-gray-500 mt-1">Taxas e deduções</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Transferência</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-600">{formatCurrency(totalTransferred)}</div>
            <p className="text-xs text-gray-500 mt-1">Líquido</p>
          </CardContent>
        </Card>
      </div>

      {/* Imóveis do Proprietário */}
      <Card>
        <CardHeader>
          <CardTitle>Meus Imóveis</CardTitle>
          <CardDescription>Imóveis alugados e sua situação</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {mockOwnerProperties.map((property) => (
              <div
                key={property.id}
                onClick={() => setSelectedProperty(property)}
                className={`p-4 border rounded-lg cursor-pointer transition-all ${
                  selectedProperty.id === property.id
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-200 hover:border-blue-300'
                }`}
              >
                <img
                  src={property.image}
                  alt={property.title}
                  className="w-full h-40 object-cover rounded mb-3"
                />
                <h3 className="font-semibold text-sm">{property.title}</h3>
                <div className="flex items-center gap-2 text-xs text-gray-600 mt-2">
                  <MapPin className="w-3 h-3" />
                  {property.address}
                </div>
                <div className="flex items-center gap-2 text-xs text-gray-600 mt-1">
                  <DollarSign className="w-3 h-3" />
                  {formatCurrency(property.rentAmount)}/mês
                </div>
                <div className="mt-3">
                  <span className={`px-2 py-1 rounded text-xs font-medium ${getStatusColor(property.status)}`}>
                    {property.status === 'alugado' ? 'Alugado' : 'Disponível'}
                  </span>
                </div>
                {property.tenant && (
                  <div className="mt-2 text-xs text-gray-600">
                    <strong>Inquilino:</strong> {property.tenant}
                  </div>
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Detalhes do Imóvel Selecionado */}
      {selectedProperty && (
        <Card>
          <CardHeader>
            <CardTitle>{selectedProperty.title}</CardTitle>
            <CardDescription>{selectedProperty.address}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-xs text-gray-600">Aluguel Mensal</p>
                <p className="text-2xl font-bold text-blue-600">{formatCurrency(selectedProperty.rentAmount)}</p>
              </div>
              <div>
                <p className="text-xs text-gray-600">Status</p>
                <p className="text-lg font-semibold mt-1">
                  <span className={`px-2 py-1 rounded text-sm ${getStatusColor(selectedProperty.status)}`}>
                    {selectedProperty.status === 'alugado' ? 'Alugado' : 'Disponível'}
                  </span>
                </p>
              </div>
              {selectedProperty.tenant && (
                <div>
                  <p className="text-xs text-gray-600">Inquilino</p>
                  <p className="text-lg font-semibold mt-1">{selectedProperty.tenant}</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Extrato de Transações */}
      <Card>
        <CardHeader>
          <CardTitle>Extrato Financeiro</CardTitle>
          <CardDescription>Histórico de transações recentes</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {mockTransactions.map((transaction) => (
              <div key={transaction.id} className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex-1">
                  <p className="font-medium text-sm">{transaction.description}</p>
                  <p className="text-xs text-gray-500">{transaction.date}</p>
                </div>
                <div className={`text-right font-semibold ${getTransactionColor(transaction.type)}`}>
                  {transaction.type === 'expense' ? '-' : '+'}
                  {formatCurrency(Math.abs(transaction.amount))}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Ações */}
      <div className="flex gap-3">
        <Button variant="outline">
          <Calendar className="w-4 h-4 mr-2" />
          Baixar Extrato
        </Button>
        <Button variant="outline">
          <TrendingUp className="w-4 h-4 mr-2" />
          Relatório Anual
        </Button>
      </div>
    </div>
  );
}
