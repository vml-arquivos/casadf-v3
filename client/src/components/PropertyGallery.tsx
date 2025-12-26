import { useState } from "react";
import { trpc } from "@/lib/trpc";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Card } from "@/components/ui/card";
import { Loader2, ZoomIn } from "lucide-react";

interface PropertyGalleryProps {
  propertyId: number;
  className?: string;
}

export default function PropertyGallery({ propertyId, className = "" }: PropertyGalleryProps) {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const { data: images, isLoading } = trpc.propertyImages.list.useQuery({ propertyId });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-96 bg-muted rounded-lg">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!images || images.length === 0) {
    return (
      <div className="flex items-center justify-center h-96 bg-muted rounded-lg">
        <p className="text-muted-foreground">Nenhuma imagem disponível</p>
      </div>
    );
  }

  const primaryImage = images.find(img => img.isPrimary === 1) || images[0];
  const thumbnails = images.slice(0, 4);

  return (
    <>
      <div className={`space-y-4 ${className}`}>
        {/* Imagem Principal */}
        <div className="relative h-96 md:h-[500px] rounded-lg overflow-hidden group cursor-pointer">
          <img
            src={primaryImage.imageUrl}
            alt={primaryImage.caption || "Imagem principal do imóvel"}
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
            onClick={() => setSelectedImage(primaryImage.imageUrl)}
          />
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center">
            <div className="opacity-0 group-hover:opacity-100 transition-opacity bg-white/90 rounded-full p-3">
              <ZoomIn className="h-6 w-6 text-black" />
            </div>
          </div>
          {images.length > 1 && (
            <div className="absolute bottom-4 right-4 bg-black/70 text-white px-3 py-1 rounded-full text-sm">
              1 / {images.length}
            </div>
          )}
        </div>

        {/* Thumbnails */}
        {images.length > 1 && (
          <div className="grid grid-cols-4 gap-2">
            {thumbnails.map((image, index) => (
              <Card
                key={image.id}
                className="relative h-24 overflow-hidden cursor-pointer group"
                onClick={() => setSelectedImage(image.imageUrl)}
              >
                <img
                  src={image.imageUrl}
                  alt={image.caption || `Imagem ${index + 1}`}
                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors" />
              </Card>
            ))}
          </div>
        )}

        {/* Carrossel completo */}
        {images.length > 4 && (
          <div className="mt-4">
            <Carousel className="w-full">
              <CarouselContent>
                {images.map((image, index) => (
                  <CarouselItem key={image.id} className="md:basis-1/3 lg:basis-1/4">
                    <Card
                      className="relative h-32 overflow-hidden cursor-pointer group"
                      onClick={() => setSelectedImage(image.imageUrl)}
                    >
                      <img
                        src={image.imageUrl}
                        alt={image.caption || `Imagem ${index + 1}`}
                        className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                      />
                      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors" />
                    </Card>
                  </CarouselItem>
                ))}
              </CarouselContent>
              <CarouselPrevious className="left-2" />
              <CarouselNext className="right-2" />
            </Carousel>
          </div>
        )}
      </div>

      {/* Modal de visualização em tela cheia */}
      <Dialog open={!!selectedImage} onOpenChange={() => setSelectedImage(null)}>
        <DialogContent className="max-w-7xl w-full p-0 bg-black/95">
          <div className="relative w-full h-[90vh] flex items-center justify-center">
            {selectedImage && (
              <img
                src={selectedImage}
                alt="Imagem ampliada"
                className="max-w-full max-h-full object-contain"
              />
            )}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
