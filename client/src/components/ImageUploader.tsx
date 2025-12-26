import { useState, useCallback, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Upload, X, Star, GripVertical } from "lucide-react";
import { toast } from "sonner";

export interface ImageFile {
  id?: number;
  url: string;
  file?: File;
  isPrimary?: boolean;
  displayOrder?: number;
}

interface ImageUploaderProps {
  images: ImageFile[];
  onChange: (images: ImageFile[]) => void;
  maxImages?: number;
}

export default function ImageUploader({
  images,
  onChange,
  maxImages = 20,
}: ImageUploaderProps) {
  const [dragActive, setDragActive] = useState(false);
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      setDragActive(false);

      const files = Array.from(e.dataTransfer.files);
      handleFiles(files);
    },
    [images]
  );

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files);
      handleFiles(files);
    }
  };

  const handleFiles = (files: File[]) => {
    const validFiles = files.filter((file) => {
      if (!file.type.startsWith("image/")) {
        toast.error(`${file.name} não é uma imagem válida`);
        return false;
      }
      if (file.size > 10 * 1024 * 1024) {
        toast.error(`${file.name} é muito grande (máx 10MB)`);
        return false;
      }
      return true;
    });

    if (images.length + validFiles.length > maxImages) {
      toast.error(`Máximo de ${maxImages} imagens permitidas`);
      return;
    }

    // Create preview URLs
    const newImages: ImageFile[] = validFiles.map((file, index) => ({
      url: URL.createObjectURL(file),
      file,
      displayOrder: images.length + index,
      isPrimary: images.length === 0 && index === 0, // First image is primary by default
    }));

    onChange([...images, ...newImages]);
    toast.success(`${validFiles.length} imagem(ns) adicionada(s)`);
  };

  const handleRemove = (index: number) => {
    const newImages = images.filter((_, i) => i !== index);
    
    // If removed image was primary, set first image as primary
    if (images[index].isPrimary && newImages.length > 0) {
      newImages[0].isPrimary = true;
    }
    
    // Update display order
    const reorderedImages = newImages.map((img, i) => ({
      ...img,
      displayOrder: i,
    }));
    
    onChange(reorderedImages);
    toast.success("Imagem removida");
  };

  const handleSetPrimary = (index: number) => {
    const newImages = images.map((img, i) => ({
      ...img,
      isPrimary: i === index,
    }));
    onChange(newImages);
    toast.success("Imagem principal definida");
  };

  const handleReorder = (fromIndex: number, toIndex: number) => {
    const newImages = [...images];
    const [movedImage] = newImages.splice(fromIndex, 1);
    newImages.splice(toIndex, 0, movedImage);

    // Update display order
    const reorderedImages = newImages.map((img, index) => ({
      ...img,
      displayOrder: index,
    }));

    onChange(reorderedImages);
  };

  const handleDragStart = (index: number) => {
    setDraggedIndex(index);
  };

  const handleDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    if (draggedIndex !== null && draggedIndex !== index) {
      handleReorder(draggedIndex, index);
      setDraggedIndex(index);
    }
  };

  const handleDragEnd = () => {
    setDraggedIndex(null);
  };

  return (
    <div className="space-y-4">
      {/* Upload Area */}
      <div
        className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
          dragActive
            ? "border-primary bg-primary/5"
            : "border-border hover:border-primary/50"
        }`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
      >
        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept="image/*"
          onChange={handleFileInput}
          className="hidden"
        />
        <Upload className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
        <p className="text-lg font-medium mb-2">
          Arraste e solte imagens aqui
        </p>
        <p className="text-sm text-muted-foreground mb-4">
          ou clique no botão abaixo para selecionar
        </p>
        <Button
          type="button"
          variant="outline"
          onClick={() => fileInputRef.current?.click()}
        >
          Selecionar Imagens
        </Button>
        <p className="text-xs text-muted-foreground mt-4">
          Máximo {maxImages} imagens • Formatos: JPG, PNG, WebP • Tamanho máx:
          10MB
        </p>
      </div>

      {/* Images Grid */}
      {images.length > 0 && (
        <div>
          <p className="text-sm text-muted-foreground mb-3">
            Arraste as imagens para reordenar. A primeira imagem será exibida como destaque.
          </p>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {images.map((image, index) => (
              <div
                key={index}
                draggable
                onDragStart={() => handleDragStart(index)}
                onDragOver={(e) => handleDragOver(e, index)}
                onDragEnd={handleDragEnd}
                className={`relative group rounded-lg overflow-hidden border-2 transition-all cursor-move ${
                  image.isPrimary
                    ? "border-yellow-500 ring-2 ring-yellow-500/20"
                    : "border-border"
                } ${draggedIndex === index ? "opacity-50 scale-95" : ""}`}
              >
                {/* Image */}
                <div className="aspect-video bg-muted relative">
                  <img
                    src={image.url}
                    alt={`Imagem ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                </div>

                {/* Controls */}
                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                  {/* Drag Handle */}
                  <button
                    type="button"
                    className="p-2 bg-white/20 hover:bg-white/30 rounded-lg cursor-move"
                    title="Arrastar para reordenar"
                  >
                    <GripVertical className="w-5 h-5 text-white" />
                  </button>

                  {/* Set Primary */}
                  <button
                    type="button"
                    onClick={() => handleSetPrimary(index)}
                    className={`p-2 rounded-lg ${
                      image.isPrimary
                        ? "bg-yellow-500 hover:bg-yellow-600"
                        : "bg-white/20 hover:bg-white/30"
                    }`}
                    title="Definir como principal"
                  >
                    <Star
                      className={`w-5 h-5 ${
                        image.isPrimary ? "text-white fill-white" : "text-white"
                      }`}
                    />
                  </button>

                  {/* Remove */}
                  <button
                    type="button"
                    onClick={() => handleRemove(index)}
                    className="p-2 bg-red-500 hover:bg-red-600 rounded-lg"
                    title="Remover imagem"
                  >
                    <X className="w-5 h-5 text-white" />
                  </button>
                </div>

                {/* Primary Badge */}
                {image.isPrimary && (
                  <div className="absolute top-2 left-2 bg-yellow-500 text-white text-xs font-bold px-2 py-1 rounded flex items-center gap-1">
                    <Star className="w-3 h-3 fill-white" />
                    Principal
                  </div>
                )}

                {/* Order Badge */}
                <div className="absolute top-2 right-2 bg-black/70 text-white text-xs font-bold px-2 py-1 rounded">
                  #{index + 1}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
