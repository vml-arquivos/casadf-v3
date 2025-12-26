import { useState } from "react";
import ImageUploader, { ImageFile } from "@/components/ImageUploader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function TestImageUpload() {
  const [images, setImages] = useState<ImageFile[]>([]);
  const [youtubeUrl, setYoutubeUrl] = useState("");
  const [vimeoUrl, setVimeoUrl] = useState("");

  const handleSave = () => {
    console.log("Imagens:", images);
    console.log("YouTube:", youtubeUrl);
    console.log("Vimeo:", vimeoUrl);
    
    // Aqui você faria o upload real para o S3 e salvaria no banco
    alert(`${images.length} imagens prontas para upload!`);
  };

  return (
    <div className="container max-w-6xl py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Upload de Fotos do Imóvel</h1>
        <p className="text-muted-foreground">
          Teste o sistema de upload com drag & drop, reordenação e definição de imagem principal
        </p>
      </div>

      <div className="space-y-8">
        {/* Image Uploader */}
        <Card>
          <CardHeader>
            <CardTitle>Fotos do Imóvel</CardTitle>
            <CardDescription>
              Adicione até 20 fotos do imóvel. Arraste para reordenar e clique na estrela para definir a imagem principal.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ImageUploader images={images} onChange={setImages} maxImages={20} />
          </CardContent>
        </Card>

        {/* Video URLs */}
        <Card>
          <CardHeader>
            <CardTitle>Vídeos do Imóvel</CardTitle>
            <CardDescription>
              Adicione links de vídeos do YouTube ou Vimeo para tour virtual
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="youtube">URL do YouTube</Label>
              <Input
                id="youtube"
                placeholder="https://www.youtube.com/watch?v=..."
                value={youtubeUrl}
                onChange={(e) => setYoutubeUrl(e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="vimeo">URL do Vimeo</Label>
              <Input
                id="vimeo"
                placeholder="https://vimeo.com/..."
                value={vimeoUrl}
                onChange={(e) => setVimeoUrl(e.target.value)}
              />
            </div>
          </CardContent>
        </Card>

        {/* Summary */}
        <Card>
          <CardHeader>
            <CardTitle>Resumo</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2 text-sm">
              <p>
                <strong>Total de imagens:</strong> {images.length}
              </p>
              <p>
                <strong>Imagem principal:</strong>{" "}
                {images.find((img) => img.isPrimary)
                  ? `Imagem #${images.findIndex((img) => img.isPrimary) + 1}`
                  : "Nenhuma"}
              </p>
              <p>
                <strong>Vídeo YouTube:</strong> {youtubeUrl || "Não informado"}
              </p>
              <p>
                <strong>Vídeo Vimeo:</strong> {vimeoUrl || "Não informado"}
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Actions */}
        <div className="flex gap-4">
          <Button onClick={handleSave} size="lg">
            Salvar Imóvel
          </Button>
          <Button
            variant="outline"
            onClick={() => {
              setImages([]);
              setYoutubeUrl("");
              setVimeoUrl("");
            }}
            size="lg"
          >
            Limpar Tudo
          </Button>
        </div>
      </div>
    </div>
  );
}
