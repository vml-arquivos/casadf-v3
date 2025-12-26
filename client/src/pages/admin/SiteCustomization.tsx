import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Paintbrush, Image as ImageIcon, Info, Save, Eye } from "lucide-react";

const customizationSchema = z.object({
  themeStyle: z.enum(["modern", "classic"]).optional(),
  primaryColor: z.string().regex(/^#[0-9A-Fa-f]{6}$/, "Cor inválida (use formato #RRGGBB)").optional(),
  heroTitle: z.string().optional(),
  heroSubtitle: z.string().optional(),
  heroBackgroundImage: z.string().optional(),
  aboutSectionTitle: z.string().optional(),
  aboutSectionContent: z.string().optional(),
  aboutSectionImage: z.string().optional(),
});

type CustomizationFormData = z.infer<typeof customizationSchema>;

export default function SiteCustomization() {
  const [isLoading, setIsLoading] = useState(false);
  const [previewColor, setPreviewColor] = useState("#0f172a");

  const { data: settings, isLoading: loadingSettings } = trpc.settings.get.useQuery();
  const updateSettings = trpc.settings.update.useMutation({
    onSuccess: () => {
      toast.success("Configurações atualizadas com sucesso!");
      setIsLoading(false);
    },
    onError: (error) => {
      toast.error(error.message || "Erro ao atualizar configurações");
      setIsLoading(false);
    },
  });

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<CustomizationFormData>({
    resolver: zodResolver(customizationSchema),
  });

  const watchedColor = watch("primaryColor");
  const watchedTheme = watch("themeStyle");

  useEffect(() => {
    if (settings) {
      setValue("themeStyle", settings.themeStyle as "modern" | "classic" || "modern");
      setValue("primaryColor", settings.primaryColor || "#0f172a");
      setValue("heroTitle", settings.heroTitle || "");
      setValue("heroSubtitle", settings.heroSubtitle || "");
      setValue("heroBackgroundImage", settings.heroBackgroundImage || "");
      setValue("aboutSectionTitle", settings.aboutSectionTitle || "");
      setValue("aboutSectionContent", settings.aboutSectionContent || "");
      setValue("aboutSectionImage", settings.aboutSectionImage || "");
      setPreviewColor(settings.primaryColor || "#0f172a");
    }
  }, [settings, setValue]);

  useEffect(() => {
    if (watchedColor) {
      setPreviewColor(watchedColor);
    }
  }, [watchedColor]);

  const onSubmit = async (data: CustomizationFormData) => {
    setIsLoading(true);
    await updateSettings.mutateAsync(data);
  };

  if (loadingSettings) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-600 mx-auto mb-4"></div>
          <p className="text-slate-600">Carregando configurações...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 px-4 max-w-5xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900 mb-2">Personalizar Site</h1>
        <p className="text-slate-600">
          Customize a aparência do seu site sem editar código. As alterações serão refletidas imediatamente na página inicial.
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)}>
        <Tabs defaultValue="theme" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="theme">
              <Paintbrush className="w-4 h-4 mr-2" />
              Tema & Cores
            </TabsTrigger>
            <TabsTrigger value="hero">
              <ImageIcon className="w-4 h-4 mr-2" />
              Seção Hero
            </TabsTrigger>
            <TabsTrigger value="about">
              <Info className="w-4 h-4 mr-2" />
              Seção Sobre
            </TabsTrigger>
          </TabsList>

          {/* Tab: Tema & Cores */}
          <TabsContent value="theme">
            <Card>
              <CardHeader>
                <CardTitle>Tema e Cores</CardTitle>
                <CardDescription>
                  Escolha o estilo visual e a cor principal do seu site
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Estilo do Tema */}
                <div className="space-y-2">
                  <Label htmlFor="themeStyle">Estilo do Tema</Label>
                  <Select
                    value={watchedTheme || "modern"}
                    onValueChange={(value) => setValue("themeStyle", value as "modern" | "classic")}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione o estilo" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="modern">Moderno (Full-width, minimalista)</SelectItem>
                      <SelectItem value="classic">Clássico (Centralizado, tradicional)</SelectItem>
                    </SelectContent>
                  </Select>
                  <p className="text-xs text-slate-500">
                    O estilo moderno usa layout full-width. O clássico usa containers centralizados.
                  </p>
                </div>

                {/* Cor Primária */}
                <div className="space-y-2">
                  <Label htmlFor="primaryColor">Cor Primária</Label>
                  <div className="flex gap-4 items-center">
                    <Input
                      id="primaryColor"
                      type="color"
                      {...register("primaryColor")}
                      className="w-24 h-12 cursor-pointer"
                    />
                    <Input
                      type="text"
                      {...register("primaryColor")}
                      placeholder="#0f172a"
                      className="flex-1"
                    />
                  </div>
                  {errors.primaryColor && (
                    <p className="text-sm text-red-600">{errors.primaryColor.message}</p>
                  )}
                  <div className="mt-4 p-4 border rounded-lg bg-slate-50">
                    <p className="text-sm font-medium mb-2">Preview da Cor:</p>
                    <div className="flex gap-2">
                      <Button
                        type="button"
                        style={{ backgroundColor: previewColor }}
                        className="text-white"
                      >
                        Botão Exemplo
                      </Button>
                      <div
                        className="w-12 h-12 rounded-lg border-2"
                        style={{ backgroundColor: previewColor }}
                      ></div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Tab: Seção Hero */}
          <TabsContent value="hero">
            <Card>
              <CardHeader>
                <CardTitle>Seção Hero (Banner Principal)</CardTitle>
                <CardDescription>
                  Configure o título, subtítulo e imagem de fundo da seção principal
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="heroTitle">Título Principal</Label>
                  <Input
                    id="heroTitle"
                    {...register("heroTitle")}
                    placeholder="Ex: Encontre o Imóvel dos Seus Sonhos"
                  />
                  <p className="text-xs text-slate-500">
                    Título grande exibido no topo da página inicial
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="heroSubtitle">Subtítulo</Label>
                  <Textarea
                    id="heroSubtitle"
                    {...register("heroSubtitle")}
                    placeholder="Ex: Imóveis de alto padrão em Brasília com atendimento personalizado"
                    rows={3}
                  />
                  <p className="text-xs text-slate-500">
                    Texto de apoio abaixo do título principal
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="heroBackgroundImage">URL da Imagem de Fundo</Label>
                  <Input
                    id="heroBackgroundImage"
                    {...register("heroBackgroundImage")}
                    placeholder="https://example.com/hero-bg.jpg"
                  />
                  <p className="text-xs text-slate-500">
                    URL completa da imagem de fundo (recomendado: 1920x1080px)
                  </p>
                  {watch("heroBackgroundImage") && (
                    <div className="mt-4 border rounded-lg overflow-hidden">
                      <img
                        src={watch("heroBackgroundImage")}
                        alt="Preview Hero"
                        className="w-full h-48 object-cover"
                        onError={(e) => {
                          e.currentTarget.src = "https://via.placeholder.com/1920x1080?text=Imagem+Inválida";
                        }}
                      />
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Tab: Seção Sobre */}
          <TabsContent value="about">
            <Card>
              <CardHeader>
                <CardTitle>Seção Sobre</CardTitle>
                <CardDescription>
                  Configure o conteúdo da seção "Sobre Nós" ou "Quem Somos"
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="aboutSectionTitle">Título da Seção</Label>
                  <Input
                    id="aboutSectionTitle"
                    {...register("aboutSectionTitle")}
                    placeholder="Ex: Sobre a Casa DF"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="aboutSectionContent">Conteúdo</Label>
                  <Textarea
                    id="aboutSectionContent"
                    {...register("aboutSectionContent")}
                    placeholder="Descreva sua empresa, missão, valores..."
                    rows={6}
                  />
                  <p className="text-xs text-slate-500">
                    Texto completo da seção sobre (suporta múltiplos parágrafos)
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="aboutSectionImage">URL da Imagem</Label>
                  <Input
                    id="aboutSectionImage"
                    {...register("aboutSectionImage")}
                    placeholder="https://example.com/about-image.jpg"
                  />
                  <p className="text-xs text-slate-500">
                    Imagem ilustrativa para a seção sobre (recomendado: 800x600px)
                  </p>
                  {watch("aboutSectionImage") && (
                    <div className="mt-4 border rounded-lg overflow-hidden">
                      <img
                        src={watch("aboutSectionImage")}
                        alt="Preview About"
                        className="w-full h-48 object-cover"
                        onError={(e) => {
                          e.currentTarget.src = "https://via.placeholder.com/800x600?text=Imagem+Inválida";
                        }}
                      />
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Botões de Ação */}
        <div className="flex gap-4 mt-8">
          <Button
            type="submit"
            disabled={isLoading}
            className="bg-amber-600 hover:bg-amber-700"
          >
            <Save className="w-4 h-4 mr-2" />
            {isLoading ? "Salvando..." : "Salvar Alterações"}
          </Button>
          <Button
            type="button"
            variant="outline"
            onClick={() => window.open("/", "_blank")}
          >
            <Eye className="w-4 h-4 mr-2" />
            Visualizar Site
          </Button>
        </div>
      </form>
    </div>
  );
}
