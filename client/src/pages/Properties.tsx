import { useState, useEffect } from "react";
import { Helmet } from "react-helmet-async";
import { useLocation } from "wouter";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import PropertyFilterBar, { PropertyFilters } from "@/components/PropertyFilterBar";
import PropertyCard, { Property } from "@/components/PropertyCard";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Grid3x3, List } from "lucide-react";
import { trpc } from "@/lib/trpc";

export default function Properties() {
  const [location, setLocation] = useLocation();
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [sortBy, setSortBy] = useState<"recent" | "price_asc" | "price_desc">("recent");
  
  const [filters, setFilters] = useState<PropertyFilters>({
    transactionType: "venda",
    propertyType: "",
    neighborhood: "",
    minPrice: 0,
    maxPrice: 5000000,
    bedrooms: "",
    features: [],
  });

  // Ler query params da URL ao carregar
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const finalidade = params.get("finalidade");
    const tipo = params.get("tipo");
    const bairro = params.get("bairro");
    
    if (finalidade || tipo || bairro) {
      setFilters(prev => ({
        ...prev,
        transactionType: finalidade === "aluguel" ? "aluguel" : "venda",
        propertyType: tipo || "",
        neighborhood: bairro || "",
      }));
    }
  }, [location]);

  const { data: propertiesData, isLoading } = trpc.properties.list.useQuery();

  // Converter dados do backend para formato do PropertyCard
  const convertedProperties: Property[] = propertiesData
    ? propertiesData.map((p) => ({
        id: p.id,
        title: p.title,
        description: p.description || "",
        price: Number(p.salePrice || p.rentPrice || 0),
        transactionType: p.transactionType === "locacao" ? "aluguel" : "venda",
        propertyType: p.type || "Apartamento",
        neighborhood: p.neighborhood || "",
        city: p.city || "Brasília",
        bedrooms: p.bedrooms || 0,
        bathrooms: p.bathrooms || 0,
        area: Number(p.totalArea || 0),
        garageSpaces: p.parkingSpaces || 0,
        images: p.mainImage ? [p.mainImage] : [],
        featured: false,
        createdAt: p.createdAt || new Date(),
      }))
    : [];

  // Filtrar imóveis
  const filteredProperties = convertedProperties.filter((property) => {
    // Filtro de finalidade
    if (filters.transactionType && property.transactionType !== filters.transactionType) {
      return false;
    }

    // Filtro de tipo
    if (filters.propertyType && property.propertyType?.toLowerCase() !== filters.propertyType?.toLowerCase()) {
      return false;
    }

    // Filtro de bairro
    if (filters.neighborhood && property.neighborhood !== filters.neighborhood) {
      return false;
    }

    // Filtro de preço
    if (property.price < filters.minPrice || property.price > filters.maxPrice) {
      return false;
    }

    // Filtro de quartos
    if (filters.bedrooms) {
      const minBedrooms = parseInt(filters.bedrooms.replace("+", ""));
      if (property.bedrooms < minBedrooms) {
        return false;
      }
    }

    // TODO: Implementar filtro de características quando o backend suportar
    
    return true;
  });

  // Ordenar imóveis
  const sortedProperties = [...filteredProperties].sort((a, b) => {
    if (sortBy === "price_asc") {
      return a.price - b.price;
    } else if (sortBy === "price_desc") {
      return b.price - a.price;
    } else {
      // recent
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    }
  });

  const resultCount = sortedProperties.length;

  return (
    <>
      <Helmet>
        <title>Imóveis em Brasília - Casa DF Imóveis</title>
        <meta
          name="description"
          content="Encontre os melhores imóveis para compra e aluguel em Brasília. Apartamentos, casas, coberturas e mais."
        />
      </Helmet>

      <Header />

      <div className="min-h-screen bg-muted/30">
        {/* Hero Section */}
        <section className="bg-gradient-to-br from-primary/10 to-primary/5 py-12">
          <div className="container">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Imóveis em Brasília
            </h1>
            <p className="text-lg text-muted-foreground">
              Encontre o imóvel perfeito para você
            </p>
          </div>
        </section>

        {/* Filters */}
        <section className="container -mt-8 mb-8">
          <PropertyFilterBar onFilterChange={setFilters} resultCount={resultCount} />
        </section>

        {/* Results */}
        <section className="container pb-20">
          {/* Toolbar */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2">
              <Button
                variant={viewMode === "grid" ? "default" : "outline"}
                size="icon"
                onClick={() => setViewMode("grid")}
              >
                <Grid3x3 className="w-4 h-4" />
              </Button>
              <Button
                variant={viewMode === "list" ? "default" : "outline"}
                size="icon"
                onClick={() => setViewMode("list")}
              >
                <List className="w-4 h-4" />
              </Button>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">Ordenar por:</span>
              <select
                className="border rounded-md px-3 py-2 text-sm bg-white"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
              >
                <option value="recent">Mais Recentes</option>
                <option value="price_asc">Menor Preço</option>
                <option value="price_desc">Maior Preço</option>
              </select>
            </div>
          </div>

          {/* Property Grid */}
          {isLoading ? (
            <div className={`grid gap-6 ${viewMode === "grid" ? "grid-cols-1 md:grid-cols-2 lg:grid-cols-3" : "grid-cols-1"}`}>
              {[...Array(6)].map((_, i) => (
                <div key={i} className="space-y-4">
                  <Skeleton className="aspect-[4/3] w-full" />
                  <Skeleton className="h-6 w-3/4" />
                  <Skeleton className="h-4 w-1/2" />
                </div>
              ))}
            </div>
          ) : sortedProperties.length > 0 ? (
            <div className={`grid gap-6 ${viewMode === "grid" ? "grid-cols-1 md:grid-cols-2 lg:grid-cols-3" : "grid-cols-1"}`}>
              {sortedProperties.map((property) => (
                <PropertyCard key={property.id} property={property} />
              ))}
            </div>
          ) : (
            <div className="text-center py-20">
              <h3 className="text-2xl font-semibold mb-2">Nenhum imóvel encontrado</h3>
              <p className="text-muted-foreground mb-6">
                Tente ajustar os filtros para encontrar mais opções
              </p>
              <Button onClick={() => setFilters({
                transactionType: "venda",
                propertyType: "",
                neighborhood: "",
                minPrice: 0,
                maxPrice: 5000000,
                bedrooms: "",
                features: [],
              })}>
                Limpar Filtros
              </Button>
            </div>
          )}
        </section>
      </div>

      <Footer />
    </>
  );
}
