import { trpc } from "@/lib/trpc";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowLeft, Save, Loader2 } from "lucide-react";
import { useLocation, useParams } from "wouter";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import AdminLayout from "@/components/AdminLayout";
import PropertyImageUpload from "@/components/PropertyImageUpload";

export default function PropertyEdit() {
  const [, setLocation] = useLocation();
  const params = useParams();
  const propertyId = params.id ? parseInt(params.id) : null;

  const [formData, setFormData] = useState<{
    title: string;
    description: string;
    propertyType: "casa" | "apartamento" | "cobertura" | "terreno" | "comercial" | "rural" | "lancamento";
    transactionType: "venda" | "locacao" | "ambos";
    neighborhood: string;
    city: string;
    state: string;
    salePrice: number;
    rentPrice: number;
    bedrooms: number;
    bathrooms: number;
    parkingSpaces: number;
    totalArea: number;
    status: "disponivel" | "reservado" | "vendido" | "alugado" | "inativo";
    featured: boolean;
  }>({
    title: "",
    description: "",
    propertyType: "casa",
    transactionType: "venda",
    neighborhood: "",
    city: "Brasília",
    state: "DF",
    salePrice: 0,
    rentPrice: 0,
    bedrooms: 0,
    bathrooms: 0,
    parkingSpaces: 0,
    totalArea: 0,
    status: "disponivel",
    featured: false,
  });

  const { data: property, isLoading: loadingProperty } = trpc.properties.getById.useQuery(
    { id: propertyId! },
    { enabled: !!propertyId }
  );

  const updateMutation = trpc.properties.update.useMutation({
    onSuccess: () => {
      toast.success("Imóvel atualizado com sucesso!");
    },
    onError: (error) => {
      toast.error(`Erro ao atualizar imóvel: ${error.message}`);
    },
  });

  useEffect(() => {
    if (property) {
      setFormData({
        title: property.title || "",
        description: property.description || "",
        propertyType: property.propertyType || "casa",
        transactionType: property.transactionType || "venda",
        neighborhood: property.neighborhood || "",
        city: property.city || "Brasília",
        state: property.state || "DF",
        salePrice: property.salePrice || 0,
        rentPrice: property.rentPrice || 0,
        bedrooms: property.bedrooms || 0,
        bathrooms: property.bathrooms || 0,
        parkingSpaces: property.parkingSpaces || 0,
        totalArea: property.totalArea || 0,
        status: property.status || "disponivel",
        featured: property.featured ? true : false,
      });
    }
  }, [property]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!propertyId) return;

    await updateMutation.mutateAsync({
      id: propertyId,
      data: {
        ...formData,
        featured: formData.featured,
      },
    });
  };

  const handleChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  if (loadingProperty) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </AdminLayout>
    );
  }

  if (!propertyId || !property) {
    return (
      <AdminLayout>
        <div className="text-center py-12">
          <p className="text-muted-foreground">Imóvel não encontrado</p>
          <Button onClick={() => setLocation('/admin/properties')} className="mt-4">
            Voltar para Imóveis
          </Button>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setLocation('/admin/properties')}
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <div>
              <h1 className="text-3xl font-bold">Editar Imóvel</h1>
              <p className="text-muted-foreground">
                {property.referenceCode || `ID: ${property.id}`}
              </p>
            </div>
          </div>
          <Button onClick={handleSubmit} disabled={updateMutation.isPending}>
            {updateMutation.isPending ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Salvando...
              </>
            ) : (
              <>
                <Save className="mr-2 h-4 w-4" />
                Salvar Alterações
              </>
            )}
          </Button>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="info" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="info">Informações</TabsTrigger>
            <TabsTrigger value="images">Fotos</TabsTrigger>
          </TabsList>

          <TabsContent value="info" className="space-y-6">
            <form onSubmit={handleSubmit} className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Informações Básicas</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="title">Título *</Label>
                      <Input
                        id="title"
                        value={formData.title}
                        onChange={(e) => handleChange('title', e.target.value)}
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="propertyType">Tipo de Imóvel *</Label>
                      <Select
                        value={formData.propertyType}
                        onValueChange={(value) => handleChange('propertyType', value)}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="casa">Casa</SelectItem>
                          <SelectItem value="apartamento">Apartamento</SelectItem>
                          <SelectItem value="cobertura">Cobertura</SelectItem>
                          <SelectItem value="terreno">Terreno</SelectItem>
                          <SelectItem value="comercial">Comercial</SelectItem>
                          <SelectItem value="rural">Rural</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="description">Descrição</Label>
                    <Textarea
                      id="description"
                      value={formData.description}
                      onChange={(e) => handleChange('description', e.target.value)}
                      rows={4}
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="transactionType">Finalidade *</Label>
                      <Select
                        value={formData.transactionType}
                        onValueChange={(value) => handleChange('transactionType', value)}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="venda">Venda</SelectItem>
                          <SelectItem value="locacao">Locação</SelectItem>
                          <SelectItem value="ambos">Ambos</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="status">Status</Label>
                      <Select
                        value={formData.status}
                        onValueChange={(value) => handleChange('status', value)}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="disponivel">Disponível</SelectItem>
                          <SelectItem value="reservado">Reservado</SelectItem>
                          <SelectItem value="vendido">Vendido</SelectItem>
                          <SelectItem value="alugado">Alugado</SelectItem>
                          <SelectItem value="inativo">Inativo</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="neighborhood">Bairro</Label>
                      <Input
                        id="neighborhood"
                        value={formData.neighborhood}
                        onChange={(e) => handleChange('neighborhood', e.target.value)}
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Valores e Características</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="salePrice">Preço de Venda (R$)</Label>
                      <Input
                        id="salePrice"
                        type="number"
                        value={formData.salePrice}
                        onChange={(e) => handleChange('salePrice', parseFloat(e.target.value) || 0)}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="rentPrice">Preço de Locação (R$)</Label>
                      <Input
                        id="rentPrice"
                        type="number"
                        value={formData.rentPrice}
                        onChange={(e) => handleChange('rentPrice', parseFloat(e.target.value) || 0)}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="bedrooms">Quartos</Label>
                      <Input
                        id="bedrooms"
                        type="number"
                        value={formData.bedrooms}
                        onChange={(e) => handleChange('bedrooms', parseInt(e.target.value) || 0)}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="bathrooms">Banheiros</Label>
                      <Input
                        id="bathrooms"
                        type="number"
                        value={formData.bathrooms}
                        onChange={(e) => handleChange('bathrooms', parseInt(e.target.value) || 0)}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="parkingSpaces">Vagas</Label>
                      <Input
                        id="parkingSpaces"
                        type="number"
                        value={formData.parkingSpaces}
                        onChange={(e) => handleChange('parkingSpaces', parseInt(e.target.value) || 0)}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="totalArea">Área (m²)</Label>
                      <Input
                        id="totalArea"
                        type="number"
                        value={formData.totalArea}
                        onChange={(e) => handleChange('totalArea', parseFloat(e.target.value) || 0)}
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </form>
          </TabsContent>

          <TabsContent value="images">
            <Card>
              <CardHeader>
                <CardTitle>Galeria de Fotos</CardTitle>
                <p className="text-sm text-muted-foreground">
                  Faça upload de fotos do imóvel. A primeira imagem será definida como principal.
                </p>
              </CardHeader>
              <CardContent>
                <PropertyImageUpload propertyId={propertyId} />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </AdminLayout>
  );
}
