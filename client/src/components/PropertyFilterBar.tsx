import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Search, SlidersHorizontal, X } from "lucide-react";

export interface PropertyFilters {
  transactionType: string; // "venda" | "aluguel"
  propertyType: string; // "apartamento" | "casa" | "cobertura" | "terreno" | "comercial"
  neighborhood: string;
  minPrice: number;
  maxPrice: number;
  bedrooms: string; // "1+" | "2+" | "3+" | "4+"
  features: string[]; // ["piscina", "churrasqueira", "garagem", ...]
}

interface PropertyFilterBarProps {
  onFilterChange: (filters: PropertyFilters) => void;
  resultCount?: number;
}

const BAIRROS_BRASILIA = [
  "Asa Sul",
  "Asa Norte",
  "Lago Sul",
  "Lago Norte",
  "Águas Claras",
  "Taguatinga",
  "Ceilândia",
  "Samambaia",
  "Guará",
  "Sudoeste/Octogonal",
  "Park Way",
  "Vicente Pires",
  "Sobradinho",
  "Planaltina",
  "Gama",
  "Santa Maria",
  "Recanto das Emas",
  "Riacho Fundo",
  "Arniqueira",
  "Sol Nascente",
];

const PROPERTY_TYPES = [
  { value: "apartamento", label: "Apartamento" },
  { value: "casa", label: "Casa" },
  { value: "cobertura", label: "Cobertura" },
  { value: "terreno", label: "Terreno" },
  { value: "comercial", label: "Comercial" },
  { value: "kitnet", label: "Kitnet/Studio" },
  { value: "chacara", label: "Chácara" },
];

const FEATURES = [
  { value: "piscina", label: "Piscina" },
  { value: "churrasqueira", label: "Churrasqueira" },
  { value: "garagem", label: "Garagem" },
  { value: "elevador", label: "Elevador" },
  { value: "academia", label: "Academia" },
  { value: "playground", label: "Playground" },
  { value: "salao_festas", label: "Salão de Festas" },
  { value: "portaria_24h", label: "Portaria 24h" },
  { value: "varanda", label: "Varanda" },
  { value: "quintal", label: "Quintal" },
];

export default function PropertyFilterBar({ onFilterChange, resultCount }: PropertyFilterBarProps) {
  const [filters, setFilters] = useState<PropertyFilters>({
    transactionType: "venda",
    propertyType: "",
    neighborhood: "",
    minPrice: 0,
    maxPrice: 5000000,
    bedrooms: "",
    features: [],
  });

  const [priceRange, setPriceRange] = useState<[number, number]>([0, 5000000]);
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);

  const updateFilter = (key: keyof PropertyFilters, value: any) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    onFilterChange(newFilters);
  };

  const toggleFeature = (feature: string) => {
    const newFeatures = filters.features.includes(feature)
      ? filters.features.filter((f) => f !== feature)
      : [...filters.features, feature];
    updateFilter("features", newFeatures);
  };

  const clearFilters = () => {
    const defaultFilters: PropertyFilters = {
      transactionType: "venda",
      propertyType: "",
      neighborhood: "",
      minPrice: 0,
      maxPrice: 5000000,
      bedrooms: "",
      features: [],
    };
    setFilters(defaultFilters);
    setPriceRange([0, 5000000]);
    onFilterChange(defaultFilters);
  };

  const formatPrice = (value: number) => {
    if (value >= 1000000) {
      return `R$ ${(value / 1000000).toFixed(1)}M`;
    }
    if (value >= 1000) {
      return `R$ ${(value / 1000).toFixed(0)}K`;
    }
    return `R$ ${value}`;
  };

  const activeFiltersCount = [
    filters.propertyType,
    filters.neighborhood,
    filters.bedrooms,
    ...filters.features,
  ].filter(Boolean).length;

  return (
    <Card className="sticky top-20 z-40 shadow-lg">
      <CardContent className="p-6">
        {/* Transaction Type Tabs */}
        <div className="flex gap-2 mb-6">
          <Button
            variant={filters.transactionType === "venda" ? "default" : "outline"}
            className="flex-1"
            onClick={() => updateFilter("transactionType", "venda")}
          >
            Comprar
          </Button>
          <Button
            variant={filters.transactionType === "aluguel" ? "default" : "outline"}
            className="flex-1"
            onClick={() => updateFilter("transactionType", "aluguel")}
          >
            Alugar
          </Button>
        </div>

        {/* Main Filters */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
          {/* Property Type */}
          <Select value={filters.propertyType} onValueChange={(value) => updateFilter("propertyType", value)}>
            <SelectTrigger>
              <SelectValue placeholder="Tipo de Imóvel" />
            </SelectTrigger>
            <SelectContent>
              {PROPERTY_TYPES.map((type) => (
                <SelectItem key={type.value} value={type.value}>
                  {type.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {/* Neighborhood */}
          <Select value={filters.neighborhood} onValueChange={(value) => updateFilter("neighborhood", value)}>
            <SelectTrigger>
              <SelectValue placeholder="Bairro" />
            </SelectTrigger>
            <SelectContent className="max-h-[300px]">
              {BAIRROS_BRASILIA.map((bairro) => (
                <SelectItem key={bairro} value={bairro}>
                  {bairro}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {/* Bedrooms */}
          <Select value={filters.bedrooms} onValueChange={(value) => updateFilter("bedrooms", value)}>
            <SelectTrigger>
              <SelectValue placeholder="Quartos" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="1+">1+ Quarto</SelectItem>
              <SelectItem value="2+">2+ Quartos</SelectItem>
              <SelectItem value="3+">3+ Quartos</SelectItem>
              <SelectItem value="4+">4+ Quartos</SelectItem>
            </SelectContent>
          </Select>

          {/* Advanced Filters Button */}
          <Popover open={showAdvancedFilters} onOpenChange={setShowAdvancedFilters}>
            <PopoverTrigger asChild>
              <Button variant="outline" className="relative">
                <SlidersHorizontal className="w-4 h-4 mr-2" />
                Mais Filtros
                {activeFiltersCount > 0 && (
                  <Badge className="ml-2 h-5 w-5 p-0 flex items-center justify-center" variant="default">
                    {activeFiltersCount}
                  </Badge>
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-80" align="end">
              <div className="space-y-4">
                <div>
                  <h4 className="font-semibold mb-3">Faixa de Preço</h4>
                  <Slider
                    min={0}
                    max={5000000}
                    step={50000}
                    value={priceRange}
                    onValueChange={(value) => {
                      setPriceRange(value as [number, number]);
                      updateFilter("minPrice", value[0]);
                      updateFilter("maxPrice", value[1]);
                    }}
                    className="mb-2"
                  />
                  <div className="flex justify-between text-sm text-muted-foreground">
                    <span>{formatPrice(priceRange[0])}</span>
                    <span>{formatPrice(priceRange[1])}</span>
                  </div>
                </div>

                <div>
                  <h4 className="font-semibold mb-3">Características</h4>
                  <div className="grid grid-cols-2 gap-3">
                    {FEATURES.map((feature) => (
                      <div key={feature.value} className="flex items-center space-x-2">
                        <Checkbox
                          id={feature.value}
                          checked={filters.features.includes(feature.value)}
                          onCheckedChange={() => toggleFeature(feature.value)}
                        />
                        <Label
                          htmlFor={feature.value}
                          className="text-sm cursor-pointer"
                        >
                          {feature.label}
                        </Label>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </PopoverContent>
          </Popover>
        </div>

        {/* Results Count & Clear Filters */}
        <div className="flex items-center justify-between">
          <div className="text-sm text-muted-foreground">
            {resultCount !== undefined && (
              <span>
                <strong>{resultCount}</strong> {resultCount === 1 ? "imóvel encontrado" : "imóveis encontrados"}
              </span>
            )}
          </div>
          {activeFiltersCount > 0 && (
            <Button variant="ghost" size="sm" onClick={clearFilters}>
              <X className="w-4 h-4 mr-1" />
              Limpar Filtros
            </Button>
          )}
        </div>

        {/* Active Filters Tags */}
        {activeFiltersCount > 0 && (
          <div className="flex flex-wrap gap-2 mt-4">
            {filters.propertyType && (
              <Badge variant="secondary" className="cursor-pointer" onClick={() => updateFilter("propertyType", "")}>
                {PROPERTY_TYPES.find((t) => t.value === filters.propertyType)?.label}
                <X className="w-3 h-3 ml-1" />
              </Badge>
            )}
            {filters.neighborhood && (
              <Badge variant="secondary" className="cursor-pointer" onClick={() => updateFilter("neighborhood", "")}>
                {filters.neighborhood}
                <X className="w-3 h-3 ml-1" />
              </Badge>
            )}
            {filters.bedrooms && (
              <Badge variant="secondary" className="cursor-pointer" onClick={() => updateFilter("bedrooms", "")}>
                {filters.bedrooms} Quartos
                <X className="w-3 h-3 ml-1" />
              </Badge>
            )}
            {filters.features.map((feature) => (
              <Badge
                key={feature}
                variant="secondary"
                className="cursor-pointer"
                onClick={() => toggleFeature(feature)}
              >
                {FEATURES.find((f) => f.value === feature)?.label}
                <X className="w-3 h-3 ml-1" />
              </Badge>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
