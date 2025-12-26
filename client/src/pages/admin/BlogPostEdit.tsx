import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ArrowLeft, Save, Upload } from "lucide-react";
import { useLocation, useParams } from "wouter";
import { useState, useEffect } from "react";
import { toast } from "sonner";

export default function BlogPostEdit() {
  const params = useParams();
  const [, setLocation] = useLocation();
  const postId = params.id ? parseInt(params.id) : undefined;
  const isEditing = !!postId;

  const { data: post, isLoading: loadingPost } = trpc.blog.getById.useQuery(
    { id: postId! },
    { enabled: isEditing }
  );

  const { data: categories } = trpc.blog.categories.useQuery();

  const [formData, setFormData] = useState({
    title: "",
    slug: "",
    excerpt: "",
    content: "",
    featuredImage: "",
    categoryId: undefined as number | undefined,
    metaTitle: "",
    metaDescription: "",
    published: false,
  });

  const [imageFile, setImageFile] = useState<File | null>(null);
  const [uploadingImage, setUploadingImage] = useState(false);

  useEffect(() => {
    if (post) {
      setFormData({
        title: post.title,
        slug: post.slug,
        excerpt: post.excerpt || "",
        content: post.content,
        featuredImage: post.featuredImage || "",
        categoryId: post.categoryId || undefined,
        metaTitle: post.metaTitle || "",
        metaDescription: post.metaDescription || "",
        published: post.published || false,
      });
    }
  }, [post]);

  const createMutation = trpc.blog.create.useMutation({
    onSuccess: () => {
      toast.success("Post criado com sucesso!");
      setLocation('/admin/blog');
    },
    onError: (error) => {
      toast.error(`Erro ao criar post: ${error.message}`);
    },
  });

  const updateMutation = trpc.blog.update.useMutation({
    onSuccess: () => {
      toast.success("Post atualizado com sucesso!");
      setLocation('/admin/blog');
    },
    onError: (error) => {
      toast.error(`Erro ao atualizar post: ${error.message}`);
    },
  });

  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '');
  };

  const handleTitleChange = (title: string) => {
    setFormData({
      ...formData,
      title,
      slug: generateSlug(title),
    });
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setImageFile(file);
    setUploadingImage(true);

    try {
      // Criar FormData para upload
      const formDataUpload = new FormData();
      formDataUpload.append('file', file);

      // Fazer upload via API (você pode ajustar a URL conforme necessário)
      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formDataUpload,
      });

      if (!response.ok) {
        throw new Error('Erro ao fazer upload da imagem');
      }

      const { url } = await response.json();
      setFormData({ ...formData, featuredImage: url });
      toast.success('Imagem enviada com sucesso!');
    } catch (error) {
      toast.error('Erro ao enviar imagem. Tente novamente.');
      console.error(error);
    } finally {
      setUploadingImage(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.title || !formData.content) {
      toast.error('Título e conteúdo são obrigatórios');
      return;
    }

    const data = {
      ...formData,
      publishedAt: formData.published ? new Date() : undefined,
    };

    if (isEditing && postId) {
      updateMutation.mutate({
        id: postId,
        data,
      });
    } else {
      createMutation.mutate(data);
    }
  };

  if (isEditing && loadingPost) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-4xl">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={() => setLocation('/admin/blog')}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div>
          <h1 className="text-3xl font-bold">
            {isEditing ? 'Editar Post' : 'Novo Post'}
          </h1>
          <p className="text-muted-foreground mt-2">
            {isEditing ? 'Atualize as informações do post' : 'Crie um novo artigo para o blog'}
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Informações Básicas</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="title">Título *</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => handleTitleChange(e.target.value)}
                placeholder="Digite o título do post"
                required
              />
            </div>

            <div>
              <Label htmlFor="slug">Slug (URL)</Label>
              <Input
                id="slug"
                value={formData.slug}
                onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                placeholder="slug-do-post"
                required
              />
              <p className="text-sm text-muted-foreground mt-1">
                URL: /blog/{formData.slug || 'slug-do-post'}
              </p>
            </div>

            <div>
              <Label htmlFor="excerpt">Resumo</Label>
              <Textarea
                id="excerpt"
                rows={3}
                value={formData.excerpt}
                onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
                placeholder="Breve resumo do post (aparece nas listagens)"
              />
            </div>

            <div>
              <Label htmlFor="content">Conteúdo *</Label>
              <Textarea
                id="content"
                rows={15}
                value={formData.content}
                onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                placeholder="Escreva o conteúdo completo do post (suporta Markdown)"
                required
              />
              <p className="text-sm text-muted-foreground mt-1">
                Você pode usar Markdown para formatar o texto
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Imagem de Capa</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {formData.featuredImage && (
              <div className="relative w-full h-48 rounded-lg overflow-hidden">
                <img
                  src={formData.featuredImage}
                  alt="Preview"
                  className="w-full h-full object-cover"
                />
              </div>
            )}

            <div>
              <Label htmlFor="featuredImage">URL da Imagem</Label>
              <Input
                id="featuredImage"
                value={formData.featuredImage}
                onChange={(e) => setFormData({ ...formData, featuredImage: e.target.value })}
                placeholder="https://exemplo.com/imagem.jpg"
              />
            </div>

            <div className="text-center">
              <p className="text-sm text-muted-foreground mb-2">ou</p>
              <label htmlFor="imageUpload">
                <Button type="button" variant="outline" disabled={uploadingImage} asChild>
                  <span>
                    <Upload className="mr-2 h-4 w-4" />
                    {uploadingImage ? 'Enviando...' : 'Fazer Upload'}
                  </span>
                </Button>
              </label>
              <input
                id="imageUpload"
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleImageUpload}
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Categorização</CardTitle>
          </CardHeader>
          <CardContent>
            <div>
              <Label htmlFor="category">Categoria</Label>
              <Select
                value={formData.categoryId?.toString()}
                onValueChange={(value) => setFormData({ ...formData, categoryId: parseInt(value) })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione uma categoria" />
                </SelectTrigger>
                <SelectContent>
                  {categories?.map((cat) => (
                    <SelectItem key={cat.id} value={cat.id.toString()}>
                      {cat.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>SEO</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="metaTitle">Meta Título</Label>
              <Input
                id="metaTitle"
                value={formData.metaTitle}
                onChange={(e) => setFormData({ ...formData, metaTitle: e.target.value })}
                placeholder="Título otimizado para SEO"
              />
            </div>

            <div>
              <Label htmlFor="metaDescription">Meta Descrição</Label>
              <Textarea
                id="metaDescription"
                rows={3}
                value={formData.metaDescription}
                onChange={(e) => setFormData({ ...formData, metaDescription: e.target.value })}
                placeholder="Descrição para mecanismos de busca (máx 160 caracteres)"
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Publicação</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="published">Publicar Post</Label>
                <p className="text-sm text-muted-foreground">
                  {formData.published
                    ? 'O post está visível publicamente'
                    : 'O post está salvo como rascunho'}
                </p>
              </div>
              <Switch
                id="published"
                checked={formData.published}
                onCheckedChange={(checked) => setFormData({ ...formData, published: checked })}
              />
            </div>
          </CardContent>
        </Card>

        <div className="flex items-center gap-4">
          <Button
            type="submit"
            disabled={createMutation.isPending || updateMutation.isPending}
          >
            <Save className="mr-2 h-4 w-4" />
            {isEditing ? 'Atualizar Post' : 'Criar Post'}
          </Button>
          <Button
            type="button"
            variant="outline"
            onClick={() => setLocation('/admin/blog')}
          >
            Cancelar
          </Button>
        </div>
      </form>
    </div>
  );
}
