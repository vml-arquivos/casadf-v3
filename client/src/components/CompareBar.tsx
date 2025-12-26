import { useCompare } from "@/contexts/CompareContext";
import { Button } from "@/components/ui/button";
import { X, ArrowRight } from "lucide-react";
import { useLocation } from "wouter";
import { trpc } from "@/lib/trpc";
import { motion, AnimatePresence } from "framer-motion";

export default function CompareBar() {
  const { selectedProperties, removeProperty, clearAll } = useCompare();
  const [, setLocation] = useLocation();
  
  // Buscar dados dos imóveis selecionados
  const { data: properties } = trpc.properties.list.useQuery(
    {},
    {
      enabled: selectedProperties.length > 0,
    }
  );

  if (selectedProperties.length === 0) return null;

  const selectedPropertiesData = properties?.filter((p: any) =>
    selectedProperties.includes(p.id)
  ) || [];

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price / 100);
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 100, opacity: 0 }}
        className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t shadow-2xl"
      >
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between gap-4">
            {/* Left: Selected Properties */}
            <div className="flex-1 flex items-center gap-4 overflow-x-auto">
              <div className="flex items-center gap-2 flex-shrink-0">
                <h3 className="font-semibold text-sm">
                  Comparar Imóveis ({selectedProperties.length}/3)
                </h3>
              </div>

              <div className="flex gap-3">
                {selectedPropertiesData.map((property: any) => (
                  <div
                    key={property.id}
                    className="flex items-center gap-2 bg-muted px-3 py-2 rounded-lg min-w-[200px]"
                  >
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">
                        {property.title}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {formatPrice(property.salePrice || property.rentPrice || 0)}
                      </p>
                    </div>
                    <Button
                      size="icon"
                      variant="ghost"
                      className="h-6 w-6 flex-shrink-0"
                      onClick={() => removeProperty(property.id)}
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                ))}
              </div>
            </div>

            {/* Right: Actions */}
            <div className="flex items-center gap-2 flex-shrink-0">
              <Button
                variant="outline"
                size="sm"
                onClick={clearAll}
              >
                Limpar Tudo
              </Button>
              <Button
                size="sm"
                onClick={() => setLocation("/comparar-imoveis")}
                disabled={selectedProperties.length < 2}
                className="gap-2"
              >
                Comparar
                <ArrowRight className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
