import React, { useState, useMemo } from 'react';
import {
  Calculator,
  Download,
  TrendingUp,
  Building2,
  Mail,
  Phone,
  User,
  FileText,
  X,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { toast } from 'sonner';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { formatCurrency } from '@/lib/utils-types';

// Taxas dos principais bancos que atuam no DF
const BANKS = [
  { name: 'Caixa Econômica Federal', rate: 9.99, maxTerm: 420 },
  { name: 'Banco do Brasil', rate: 10.49, maxTerm: 420 },
  { name: 'Bradesco', rate: 10.99, maxTerm: 360 },
  { name: 'Itaú', rate: 11.29, maxTerm: 360 },
  { name: 'Santander', rate: 11.49, maxTerm: 360 },
  { name: 'BRB - Banco de Brasília', rate: 9.79, maxTerm: 420 },
];

interface SimulationResult {
  bank: string;
  rate: number;
  sacFirstInstallment: number;
  sacLastInstallment: number;
  sacTotalAmount: number;
  sacTotalInterest: number;
  priceInstallment: number;
  priceTotalAmount: number;
  priceTotalInterest: number;
  schedule?: Array<{
    month: number;
    principal: number;
    interest: number;
    total: number;
    balance: number;
  }>;
}

interface ClientData {
  name: string;
  email: string;
  phone: string;
  cpf?: string;
}

const FinancingSimulator: React.FC = () => {
  const [propertyValue, setPropertyValue] = useState('');
  const [downPayment, setDownPayment] = useState('');
  const [termYears, setTermYears] = useState('30');
  const [results, setResults] = useState<SimulationResult[]>([]);
  const [showResults, setShowResults] = useState(false);
  const [showClientDialog, setShowClientDialog] = useState(false);
  const [selectedResult, setSelectedResult] = useState<SimulationResult | null>(null);
  const [clientData, setClientData] = useState<ClientData>({
    name: '',
    email: '',
    phone: '',
    cpf: '',
  });

  // Calcular SAC (Sistema de Amortização Constante)
  const calculateSAC = (
    loanAmount: number,
    annualRate: number,
    months: number
  ): {
    firstInstallment: number;
    lastInstallment: number;
    totalAmount: number;
    totalInterest: number;
    schedule: Array<{
      month: number;
      principal: number;
      interest: number;
      total: number;
      balance: number;
    }>;
  } => {
    const monthlyRate = annualRate / 100 / 12;
    const amortization = loanAmount / months;
    let balance = loanAmount;
    let totalInterest = 0;
    const schedule = [];

    for (let i = 1; i <= months; i++) {
      const interest = balance * monthlyRate;
      const total = amortization + interest;
      balance -= amortization;
      totalInterest += interest;

      schedule.push({
        month: i,
        principal: amortization,
        interest,
        total,
        balance: Math.max(0, balance),
      });
    }

    return {
      firstInstallment: schedule[0].total,
      lastInstallment: schedule[months - 1].total,
      totalAmount: loanAmount + totalInterest,
      totalInterest,
      schedule,
    };
  };

  // Calcular PRICE (Sistema de Amortização Francês)
  const calculatePRICE = (
    loanAmount: number,
    annualRate: number,
    months: number
  ): {
    installment: number;
    totalAmount: number;
    totalInterest: number;
    schedule: Array<{
      month: number;
      principal: number;
      interest: number;
      total: number;
      balance: number;
    }>;
  } => {
    const monthlyRate = annualRate / 100 / 12;
    const installment =
      (loanAmount * monthlyRate * Math.pow(1 + monthlyRate, months)) /
      (Math.pow(1 + monthlyRate, months) - 1);

    let balance = loanAmount;
    let totalInterest = 0;
    const schedule = [];

    for (let i = 1; i <= months; i++) {
      const interest = balance * monthlyRate;
      const principal = installment - interest;
      balance -= principal;
      totalInterest += interest;

      schedule.push({
        month: i,
        principal,
        interest,
        total: installment,
        balance: Math.max(0, balance),
      });
    }

    return {
      installment,
      totalAmount: loanAmount + totalInterest,
      totalInterest,
      schedule,
    };
  };

  // Simular financiamento
  const handleSimulate = () => {
    if (!propertyValue || !downPayment || !termYears) {
      toast.error('Preencha todos os campos');
      return;
    }

    const property = parseFloat(propertyValue);
    const down = parseFloat(downPayment);
    const years = parseInt(termYears);

    if (down >= property) {
      toast.error('A entrada deve ser menor que o valor do imóvel');
      return;
    }

    if (down < property * 0.1) {
      toast.error('A entrada mínima é 10% do valor do imóvel');
      return;
    }

    const loanAmount = property - down;
    const months = years * 12;

    const newResults: SimulationResult[] = BANKS.map((bank) => {
      if (months > bank.maxTerm) {
        return {
          bank: bank.name,
          rate: bank.rate,
          sacFirstInstallment: 0,
          sacLastInstallment: 0,
          sacTotalAmount: 0,
          sacTotalInterest: 0,
          priceInstallment: 0,
          priceTotalAmount: 0,
          priceTotalInterest: 0,
        };
      }

      const sac = calculateSAC(loanAmount, bank.rate, months);
      const price = calculatePRICE(loanAmount, bank.rate, months);

      return {
        bank: bank.name,
        rate: bank.rate,
        sacFirstInstallment: sac.firstInstallment,
        sacLastInstallment: sac.lastInstallment,
        sacTotalAmount: sac.totalAmount,
        sacTotalInterest: sac.totalInterest,
        priceInstallment: price.installment,
        priceTotalAmount: price.totalAmount,
        priceTotalInterest: price.totalInterest,
        schedule: price.schedule,
      };
    }).filter(r => r.priceTotalAmount > 0);

    setResults(newResults);
    setShowResults(true);
  };

  // Gerar PDF
  const generatePDF = (result: SimulationResult) => {
    if (!result.schedule) return;

    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();

    // Header
    doc.setFontSize(20);
    doc.text('Simulador de Financiamento Imobiliário', pageWidth / 2, 20, { align: 'center' });

    doc.setFontSize(12);
    doc.text('Casa DF Imóveis', pageWidth / 2, 30, { align: 'center' });

    // Informações do cliente
    doc.setFontSize(11);
    doc.text(`Cliente: ${clientData.name || 'Não informado'}`, 20, 45);
    doc.text(`Email: ${clientData.email || 'Não informado'}`, 20, 52);
    doc.text(`Telefone: ${clientData.phone || 'Não informado'}`, 20, 59);

    // Informações da simulação
    doc.setFontSize(11);
    doc.text(`Banco: ${result.bank}`, 20, 75);
    doc.text(`Taxa de Juros: ${result.rate.toFixed(2)}% a.a.`, 20, 82);
    doc.text(
      `Valor do Imóvel: ${formatCurrency(parseFloat(propertyValue))}`,
      20,
      89
    );
    doc.text(`Entrada: ${formatCurrency(parseFloat(downPayment))}`, 20, 96);
    doc.text(
      `Valor do Financiamento: ${formatCurrency(parseFloat(propertyValue) - parseFloat(downPayment))}`,
      20,
      103
    );
    doc.text(`Prazo: ${termYears} anos (${parseInt(termYears) * 12} meses)`, 20, 110);

    // Comparativo SAC vs PRICE
    doc.setFontSize(12);
    doc.text('Comparativo SAC vs PRICE', 20, 130);

    const comparisonData = [
      ['Métrica', 'SAC', 'PRICE'],
      [
        'Primeira Parcela',
        formatCurrency(result.sacFirstInstallment),
        formatCurrency(result.priceInstallment),
      ],
      [
        'Última Parcela',
        formatCurrency(result.sacLastInstallment),
        formatCurrency(result.priceInstallment),
      ],
      [
        'Total de Juros',
        formatCurrency(result.sacTotalInterest),
        formatCurrency(result.priceTotalInterest),
      ],
      [
        'Total a Pagar',
        formatCurrency(result.sacTotalAmount),
        formatCurrency(result.priceTotalAmount),
      ],
    ];

    autoTable(doc, {
      head: [comparisonData[0]],
      body: comparisonData.slice(1),
      startY: 140,
      margin: { left: 20, right: 20 },
      styles: { fontSize: 10 },
      headStyles: { fillColor: [41, 128, 185] },
    });

    // Tabela de amortização (primeiras 12 parcelas)
    const currentY = (doc as any).lastAutoTable.finalY + 10;
    doc.setFontSize(12);
    doc.text('Primeiras 12 Parcelas (PRICE)', 20, currentY);

    const scheduleData = [
      ['Mês', 'Principal', 'Juros', 'Total', 'Saldo'],
      ...result.schedule.slice(0, 12).map((item) => [
        item.month.toString(),
        formatCurrency(item.principal),
        formatCurrency(item.interest),
        formatCurrency(item.total),
        formatCurrency(item.balance),
      ]),
    ];

    autoTable(doc, {
      head: [scheduleData[0]],
      body: scheduleData.slice(1),
      startY: currentY + 10,
      margin: { left: 20, right: 20 },
      styles: { fontSize: 9 },
      headStyles: { fillColor: [41, 128, 185] },
    });

    // Footer
    const finalY = (doc as any).lastAutoTable.finalY + 10;
    doc.setFontSize(9);
    doc.text(
      `Gerado em ${new Date().toLocaleDateString('pt-BR')}`,
      pageWidth / 2,
      pageHeight - 10,
      { align: 'center' }
    );

    // Salvar
    doc.save(`simulacao-${result.bank.replace(/\s+/g, '-')}.pdf`);
    toast.success('PDF gerado com sucesso!');
  };

  // Abrir dialog de cliente
  const handleViewDetails = (result: SimulationResult) => {
    setSelectedResult(result);
    setShowClientDialog(true);
  };

  // Enviar dados
  const handleSubmitClient = () => {
    if (!clientData.name || !clientData.email || !clientData.phone) {
      toast.error('Preencha todos os campos obrigatórios');
      return;
    }

    if (selectedResult) {
      generatePDF(selectedResult);
      setShowClientDialog(false);
      toast.success('Seus dados foram salvos e o PDF foi gerado!');
    }
  };

  const downPaymentPercent = propertyValue
    ? ((parseFloat(downPayment) / parseFloat(propertyValue)) * 100).toFixed(1)
    : '0';

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-12 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Calculator className="w-10 h-10 text-blue-600" />
            <h1 className="text-4xl font-bold text-gray-900">Simulador de Financiamento</h1>
          </div>
          <p className="text-gray-600 text-lg">
            Compare as melhores opções de financiamento imobiliário no Distrito Federal
          </p>
        </div>

        {/* Formulário */}
        <Card className="mb-8 shadow-lg">
          <CardHeader className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-t-lg">
            <CardTitle className="flex items-center gap-2">
              <Building2 className="w-5 h-5" />
              Informações do Imóvel
            </CardTitle>
            <CardDescription className="text-blue-100">
              Preencha os dados para simular o financiamento
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
              {/* Valor do Imóvel */}
              <div>
                <Label htmlFor="property-value" className="text-sm font-semibold">
                  Valor do Imóvel (R$)
                </Label>
                <Input
                  id="property-value"
                  type="number"
                  placeholder="0,00"
                  value={propertyValue}
                  onChange={(e) => setPropertyValue(e.target.value)}
                  className="mt-2"
                />
              </div>

              {/* Entrada */}
              <div>
                <Label htmlFor="down-payment" className="text-sm font-semibold">
                  Entrada (R$)
                </Label>
                <Input
                  id="down-payment"
                  type="number"
                  placeholder="0,00"
                  value={downPayment}
                  onChange={(e) => setDownPayment(e.target.value)}
                  className="mt-2"
                />
                {downPayment && propertyValue && (
                  <p className="text-xs text-gray-500 mt-1">{downPaymentPercent}% do valor</p>
                )}
              </div>

              {/* Prazo */}
              <div>
                <Label htmlFor="term" className="text-sm font-semibold">
                  Prazo (Anos)
                </Label>
                <Select value={termYears} onValueChange={setTermYears}>
                  <SelectTrigger id="term" className="mt-2">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {[10, 15, 20, 25, 30, 35].map((year) => (
                      <SelectItem key={year} value={year.toString()}>
                        {year} anos
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Botão Simular */}
              <div className="flex items-end">
                <Button
                  onClick={handleSimulate}
                  className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
                >
                  <TrendingUp className="w-4 h-4 mr-2" />
                  Simular
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Resultados */}
        {showResults && results.length > 0 && (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Resultados da Simulação</h2>

            {results.map((result, index) => (
              <Card key={index} className="shadow-lg hover:shadow-xl transition">
                <CardHeader className="bg-gray-50 border-b">
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-lg">{result.bank}</CardTitle>
                      <CardDescription>Taxa: {result.rate.toFixed(2)}% a.a.</CardDescription>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-gray-600">Melhor opção para:</p>
                      <p className="text-xs text-gray-500">Parcela fixa (PRICE)</p>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="pt-6">
                  <Tabs defaultValue="comparison" className="w-full">
                    <TabsList className="grid w-full grid-cols-2">
                      <TabsTrigger value="comparison">Comparativo</TabsTrigger>
                      <TabsTrigger value="details">Detalhes</TabsTrigger>
                    </TabsList>

                    {/* Tab: Comparativo */}
                    <TabsContent value="comparison" className="mt-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* SAC */}
                        <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                          <h4 className="font-semibold text-blue-900 mb-3">SAC</h4>
                          <div className="space-y-2 text-sm">
                            <div className="flex justify-between">
                              <span className="text-gray-600">1ª Parcela:</span>
                              <span className="font-semibold">
                                {formatCurrency(result.sacFirstInstallment)}
                              </span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-gray-600">Última Parcela:</span>
                              <span className="font-semibold">
                                {formatCurrency(result.sacLastInstallment)}
                              </span>
                            </div>
                            <div className="flex justify-between pt-2 border-t border-blue-200">
                              <span className="text-gray-600">Total de Juros:</span>
                              <span className="font-semibold text-red-600">
                                {formatCurrency(result.sacTotalInterest)}
                              </span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-gray-600">Total a Pagar:</span>
                              <span className="font-semibold text-blue-600">
                                {formatCurrency(result.sacTotalAmount)}
                              </span>
                            </div>
                          </div>
                        </div>

                        {/* PRICE */}
                        <div className="bg-indigo-50 p-4 rounded-lg border border-indigo-200">
                          <h4 className="font-semibold text-indigo-900 mb-3">PRICE</h4>
                          <div className="space-y-2 text-sm">
                            <div className="flex justify-between">
                              <span className="text-gray-600">Parcela Fixa:</span>
                              <span className="font-semibold">
                                {formatCurrency(result.priceInstallment)}
                              </span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-gray-600">Parcela Fixa:</span>
                              <span className="font-semibold">
                                {formatCurrency(result.priceInstallment)}
                              </span>
                            </div>
                            <div className="flex justify-between pt-2 border-t border-indigo-200">
                              <span className="text-gray-600">Total de Juros:</span>
                              <span className="font-semibold text-red-600">
                                {formatCurrency(result.priceTotalInterest)}
                              </span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-gray-600">Total a Pagar:</span>
                              <span className="font-semibold text-indigo-600">
                                {formatCurrency(result.priceTotalAmount)}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </TabsContent>

                    {/* Tab: Detalhes */}
                    <TabsContent value="details" className="mt-4">
                      <div className="bg-gray-50 p-4 rounded-lg">
                        <p className="text-sm text-gray-600 mb-4">
                          Economia com SAC:{' '}
                          <span className="font-semibold text-green-600">
                            {formatCurrency(
                              result.priceTotalInterest - result.sacTotalInterest
                            )}
                          </span>
                        </p>
                        <p className="text-xs text-gray-500">
                          O SAC começa com parcelas maiores mas diminui ao longo do tempo. O PRICE
                          mantém parcelas fixas durante todo o período.
                        </p>
                      </div>
                    </TabsContent>
                  </Tabs>

                  {/* Botões de Ação */}
                  <div className="flex gap-3 mt-6">
                    <Button
                      onClick={() => handleViewDetails(result)}
                      className="flex-1 bg-blue-600 hover:bg-blue-700"
                    >
                      <FileText className="w-4 h-4 mr-2" />
                      Ver Resultado Detalhado
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Dialog de Cliente */}
        <Dialog open={showClientDialog} onOpenChange={setShowClientDialog}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Seus Dados</DialogTitle>
              <DialogDescription>
                Preencha seus dados para receber o PDF com a simulação completa
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4">
              {/* Nome */}
              <div>
                <Label htmlFor="client-name" className="text-sm font-semibold">
                  Nome Completo *
                </Label>
                <div className="relative mt-2">
                  <User className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                  <Input
                    id="client-name"
                    placeholder="João Silva"
                    value={clientData.name}
                    onChange={(e) => setClientData({ ...clientData, name: e.target.value })}
                    className="pl-10"
                  />
                </div>
              </div>

              {/* Email */}
              <div>
                <Label htmlFor="client-email" className="text-sm font-semibold">
                  Email *
                </Label>
                <div className="relative mt-2">
                  <Mail className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                  <Input
                    id="client-email"
                    type="email"
                    placeholder="joao@email.com"
                    value={clientData.email}
                    onChange={(e) => setClientData({ ...clientData, email: e.target.value })}
                    className="pl-10"
                  />
                </div>
              </div>

              {/* Telefone */}
              <div>
                <Label htmlFor="client-phone" className="text-sm font-semibold">
                  Telefone/WhatsApp *
                </Label>
                <div className="relative mt-2">
                  <Phone className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                  <Input
                    id="client-phone"
                    placeholder="(61) 99999-9999"
                    value={clientData.phone}
                    onChange={(e) => setClientData({ ...clientData, phone: e.target.value })}
                    className="pl-10"
                  />
                </div>
              </div>

              {/* CPF */}
              <div>
                <Label htmlFor="client-cpf" className="text-sm font-semibold">
                  CPF (Opcional)
                </Label>
                <Input
                  id="client-cpf"
                  placeholder="000.000.000-00"
                  value={clientData.cpf}
                  onChange={(e) => setClientData({ ...clientData, cpf: e.target.value })}
                  className="mt-2"
                />
              </div>
            </div>

            {/* Botões */}
            <div className="flex gap-3 mt-6">
              <Button
                variant="outline"
                onClick={() => setShowClientDialog(false)}
                className="flex-1"
              >
                <X className="w-4 h-4 mr-2" />
                Cancelar
              </Button>
              <Button
                onClick={handleSubmitClient}
                className="flex-1 bg-blue-600 hover:bg-blue-700"
              >
                <Download className="w-4 h-4 mr-2" />
                Gerar PDF
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};

export default FinancingSimulator;
