import { Link } from "wouter";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Bed,
  Bath,
  Maximize,
  MapPin,
  Heart,
  Share2,
  Car,
} from "lucide-react";
import { useState } from "react";
import { useCompare } from "@/contexts/CompareContext";
import { toast } from "sonner";

export interface Property {
  id: number;
  title: string;
  description: string;
  price: number;
  transactionType: "venda" | "aluguel";
  propertyType: string;
  neighborhood: string;
  city: string;
  bedrooms: number;
  bathrooms: number;
  area: number;
  garageSpaces: number;
  images: string[];
  featured: boolean;
  createdAt: Date;
}

interface PropertyCardProps {
  property: Property;
}

export default function PropertyCard({ property }: PropertyCardProps) {
  const [isFavorite, setIsFavorite] = useState(false);
  const [imageError, setImageError] = useState(false);
  const { addProperty, removeProperty, isSelected, canAddMore } = useCompare();
  const selected = isSelected(property.id);

  const handleCompareToggle = (checked: boolean) => {
    if (checked) {
      if (!canAddMore) {
        toast.error("Você pode comparar no máximo 3 imóveis");
        return;
      }
      addProperty(property.id);
      toast.success("Imóvel adicionado à comparação");
    } else {
      removeProperty(property.id);
      toast.info("Imóvel removido da comparação");
    }
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price);
  };

  const mainImage = property.images[0] || "/placeholder-property.jpg";

  return (
    <Card className="group overflow-hidden hover:shadow-xl transition-all duration-300 border-0 bg-white">
      {/* Image Container */}
      <Link href={`/imoveis/${property.id}`}>
        <div className="relative aspect-[4/3] overflow-hidden bg-muted">
          <img
            src={imageError ? "/placeholder-property.jpg" : mainImage}
            alt={property.title}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
            onError={() => setImageError(true)}
            loading="lazy"
          />
          
          {/* Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/0 to-black/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

          {/* Compare Checkbox */}
          <div className="absolute bottom-3 left-3 z-10">
            <label 
              className="flex items-center gap-2 bg-white/95 backdrop-blur-sm px-3 py-2 rounded-lg shadow-md cursor-pointer hover:bg-white transition-colors"
              onClick={(e) => e.stopPropagation()}
            >
              <Checkbox
                checked={selected}
                onCheckedChange={handleCompareToggle}
                disabled={!selected && !canAddMore}
                className="border-2"
              />
              <span className="text-sm font-medium text-foreground">Comparar</span>
            </label>
          </div>

          {/* Badges */}
          <div className="absolute top-3 left-3 flex gap-2">
            <Badge className="bg-primary text-primary-foreground font-semibold">
              {property.transactionType === "venda" ? "Venda" : "Aluguel"}
            </Badge>
            {property.featured && (
              <Badge variant="secondary" className="bg-white/90 text-foreground">
                Destaque
              </Badge>
            )}
          </div>

          {/* Action Buttons */}
          <div className="absolute top-3 right-3 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <Button
              size="icon"
              variant="secondary"
              className="h-8 w-8 rounded-full bg-white/90 hover:bg-white"
              onClick={(e) => {
                e.preventDefault();
                setIsFavorite(!isFavorite);
              }}
            >
              <Heart className={`w-4 h-4 ${isFavorite ? "fill-red-500 text-red-500" : ""}`} />
            </Button>
            <Button
              size="icon"
              variant="secondary"
              className="h-8 w-8 rounded-full bg-white/90 hover:bg-white"
              onClick={(e) => {
                e.preventDefault();
                // Share functionality
              }}
            >
              <Share2 className="w-4 h-4" />
            </Button>
          </div>

          {/* Image Counter */}
          {property.images.length > 1 && (
            <div className="absolute bottom-3 right-3 bg-black/70 text-white px-2 py-1 rounded text-xs font-medium">
              +{property.images.length - 1} fotos
            </div>
          )}
        </div>
      </Link>

      {/* Content */}
      <CardContent className="p-4">
        {/* Price */}
        <div className="mb-3">
          <p className="text-2xl font-bold text-primary">
            {formatPrice(property.price)}
            {property.transactionType === "aluguel" && (
              <span className="text-sm text-muted-foreground font-normal">/mês</span>
            )}
          </p>
        </div>

        {/* Title */}
        <Link href={`/imoveis/${property.id}`}>
          <h3 className="text-lg font-semibold mb-2 line-clamp-2 hover:text-primary transition-colors">
            {property.title}
          </h3>
        </Link>

        {/* Location */}
        <div className="flex items-center gap-1 text-sm text-muted-foreground mb-4">
          <MapPin className="w-4 h-4 flex-shrink-0" />
          <span className="truncate">
            {property.neighborhood}, {property.city}
          </span>
        </div>

        {/* Features */}
        <div className="flex items-center gap-4 text-sm text-muted-foreground border-t pt-4">
          {property.bedrooms > 0 && (
            <div className="flex items-center gap-1">
              <Bed className="w-4 h-4" />
              <span>{property.bedrooms}</span>
            </div>
          )}
          {property.bathrooms > 0 && (
            <div className="flex items-center gap-1">
              <Bath className="w-4 h-4" />
              <span>{property.bathrooms}</span>
            </div>
          )}
          {property.area > 0 && (
            <div className="flex items-center gap-1">
              <Maximize className="w-4 h-4" />
              <span>{property.area}m²</span>
            </div>
          )}
          {property.garageSpaces > 0 && (
            <div className="flex items-center gap-1">
              <Car className="w-4 h-4" />
              <span>{property.garageSpaces}</span>
            </div>
          )}
        </div>

        {/* CTA Button */}
        <Link href={`/imoveis/${property.id}`}>
          <Button className="w-full mt-4" variant="outline">
            Ver Detalhes
          </Button>
        </Link>
      </CardContent>
    </Card>
  );
}
