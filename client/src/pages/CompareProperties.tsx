import { useCompare } from "@/contexts/CompareContext";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { X, ArrowLeft, Check, Minus } from "lucide-react";
import { useLocation } from "wouter";

export default function CompareProperties() {
  const { selectedProperties, removeProperty, clearAll } = useCompare();
  const [, setLocation] = useLocation();

  // Buscar dados dos imóveis selecionados
  const { data: properties, isLoading } = trpc.properties.list.useQuery({});

  if (selectedProperties.length < 2) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 flex items-center justify-center py-20">
          <div className="text-center max-w-md">
            <h1 className="text-3xl font-bold mb-4">Nenhum Imóvel Selecionado</h1>
            <p className="text-muted-foreground mb-6">
              Você precisa selecionar pelo menos 2 imóveis para comparar.
            </p>
            <Button onClick={() => setLocation("/imoveis")}>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Ver Imóveis
            </Button>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  const selectedPropertiesData = properties?.filter((p: any) =>
    selectedProperties.includes(p.id)
  ) || [];

  const formatPrice = (price: number | null) => {
    if (!price) return "Sob consulta";
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price / 100);
  };

  const formatArea = (area: number | null) => {
    if (!area) return "-";
    return `${area}m²`;
  };

  const getFeatureLabel = (feature: string) => {
    const labels: Record<string, string> = {
      piscina: "Piscina",
      churrasqueira: "Churrasqueira",
      academia: "Academia",
      salao_festas: "Salão de Festas",
      playground: "Playground",
      quadra: "Quadra Esportiva",
      sauna: "Sauna",
      elevador: "Elevador",
      portaria_24h: "Portaria 24h",
      varanda: "Varanda",
      jardim: "Jardim",
      garagem: "Garagem",
      quintal: "Quintal",
    };
    return labels[feature] || feature;
  };

  const parseFeatures = (features: string | null) => {
    if (!features) return [];
    try {
      return JSON.parse(features);
    } catch {
      return [];
    }
  };

  // Coletar todas as características únicas
  const allFeatures = Array.from(
    new Set(
      selectedPropertiesData.flatMap((p: any) => parseFeatures(p.features))
    )
  );

  const comparisonRows = [
    {
      label: "Preço",
      getValue: (p: any) => formatPrice(p.salePrice || p.rentPrice),
    },
    {
      label: "Tipo de Transação",
      getValue: (p: any) =>
        p.transactionType === "venda" ? "Venda" : "Aluguel",
    },
    {
      label: "Tipo de Imóvel",
      getValue: (p: any) => {
        const types: Record<string, string> = {
          casa: "Casa",
          apartamento: "Apartamento",
          cobertura: "Cobertura",
          terreno: "Terreno",
          comercial: "Comercial",
        };
        return types[p.propertyType] || p.propertyType;
      },
    },
    {
      label: "Bairro",
      getValue: (p: any) => p.neighborhood || "-",
    },
    {
      label: "Quartos",
      getValue: (p: any) => p.bedrooms || "-",
    },
    {
      label: "Banheiros",
      getValue: (p: any) => p.bathrooms || "-",
    },
    {
      label: "Suítes",
      getValue: (p: any) => p.suites || "-",
    },
    {
      label: "Vagas de Garagem",
      getValue: (p: any) => p.parkingSpaces || "-",
    },
    {
      label: "Área Total",
      getValue: (p: any) => formatArea(p.totalArea),
    },
    {
      label: "Área Construída",
      getValue: (p: any) => formatArea(p.builtArea),
    },
    {
      label: "Condomínio",
      getValue: (p: any) => (p.condoFee ? formatPrice(p.condoFee) : "-"),
    },
    {
      label: "IPTU",
      getValue: (p: any) => (p.iptu ? formatPrice(p.iptu) : "-"),
    },
  ];

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 flex items-center justify-center">
          <p>Carregando...</p>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-muted/30">
      <Header />
      
      <main className="flex-1 py-12">
        <div className="container">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <Button
                variant="ghost"
                onClick={() => setLocation("/imoveis")}
                className="mb-4"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Voltar para Imóveis
              </Button>
              <h1 className="text-4xl font-bold">Comparar Imóveis</h1>
              <p className="text-muted-foreground mt-2">
                Compare as especificações de {selectedProperties.length} imóveis lado a lado
              </p>
            </div>
            <Button variant="outline" onClick={clearAll}>
              Limpar Seleção
            </Button>
          </div>

          {/* Comparison Table */}
          <div className="overflow-x-auto">
            <div className="min-w-[800px]">
              {/* Property Cards Row */}
              <div className="grid gap-4 mb-6" style={{ gridTemplateColumns: `200px repeat(${selectedPropertiesData.length}, 1fr)` }}>
                <div></div>
                {selectedPropertiesData.map((property: any) => (
                  <Card key={property.id} className="p-4 relative">
                    <Button
                      size="icon"
                      variant="ghost"
                      className="absolute top-2 right-2 h-6 w-6"
                      onClick={() => removeProperty(property.id)}
                    >
                      <X className="w-4 h-4" />
                    </Button>
                    <div className="aspect-[4/3] overflow-hidden rounded-lg mb-3">
                      <img
                        src={property.mainImage || "/placeholder-property.jpg"}
                        alt={property.title}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <h3 className="font-semibold text-sm line-clamp-2 mb-2">
                      {property.title}
                    </h3>
                    <p className="text-lg font-bold text-primary">
                      {formatPrice(property.salePrice || property.rentPrice)}
                    </p>
                    <Button
                      className="w-full mt-3"
                      size="sm"
                      onClick={() => setLocation(`/imovel/${property.id}`)}
                    >
                      Ver Detalhes
                    </Button>
                  </Card>
                ))}
              </div>

              {/* Comparison Rows */}
              <Card className="p-6">
                <h2 className="text-xl font-bold mb-4">Especificações</h2>
                <div className="space-y-1">
                  {comparisonRows.map((row, index) => (
                    <div
                      key={index}
                      className="grid gap-4 py-3 border-b last:border-0"
                      style={{ gridTemplateColumns: `200px repeat(${selectedPropertiesData.length}, 1fr)` }}
                    >
                      <div className="font-medium text-sm text-muted-foreground">
                        {row.label}
                      </div>
                      {selectedPropertiesData.map((property: any) => (
                        <div key={property.id} className="text-sm">
                          {row.getValue(property)}
                        </div>
                      ))}
                    </div>
                  ))}
                </div>

                {/* Features Section */}
                {allFeatures.length > 0 && (
                  <>
                    <h2 className="text-xl font-bold mt-8 mb-4">Características</h2>
                    <div className="space-y-1">
                      {allFeatures.map((feature, index) => (
                        <div
                          key={index}
                          className="grid gap-4 py-3 border-b last:border-0"
                          style={{ gridTemplateColumns: `200px repeat(${selectedPropertiesData.length}, 1fr)` }}
                        >
                          <div className="font-medium text-sm text-muted-foreground">
                            {getFeatureLabel(feature)}
                          </div>
                          {selectedPropertiesData.map((property: any) => {
                            const propertyFeatures = parseFeatures(property.features);
                            const hasFeature = propertyFeatures.includes(feature);
                            return (
                              <div key={property.id} className="flex items-center">
                                {hasFeature ? (
                                  <Check className="w-5 h-5 text-green-600" />
                                ) : (
                                  <Minus className="w-5 h-5 text-muted-foreground" />
                                )}
                              </div>
                            );
                          })}
                        </div>
                      ))}
                    </div>
                  </>
                )}
              </Card>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
