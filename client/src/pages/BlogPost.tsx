import { trpc } from "@/lib/trpc";
import { Link, useParams } from "wouter";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calendar, User, ArrowLeft, Share2, Facebook, Twitter, Linkedin } from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

export default function BlogPost() {
  const params = useParams();
  const slug = params.slug as string;

  const { data: post, isLoading } = trpc.blog.getPostBySlug.useQuery({ slug });
  const { data: categories } = trpc.blog.categories.useQuery();

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col bg-white">
        <Header />
        <div className="flex-1 flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
        <Footer />
      </div>
    );
  }

  if (!post) {
    return (
      <div className="min-h-screen flex flex-col bg-white">
        <Header />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-4xl font-bold mb-4">Post não encontrado</h1>
            <Link href="/blog">
              <Button>
                <ArrowLeft className="h-4 w-4 mr-2" />
                Voltar para o Blog
              </Button>
            </Link>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  const category = categories?.find((c) => c.id === post.categoryId);
  const shareUrl = typeof window !== "undefined" ? window.location.href : "";
  const shareTitle = encodeURIComponent(post.title);

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Header />

      <main className="flex-1">
        {/* Hero com imagem destacada */}
        {post.featuredImage && (
          <div
            className="h-96 bg-cover bg-center relative"
            style={{ backgroundImage: `url(${post.featuredImage})` }}
          >
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
          </div>
        )}

        <article className="py-12">
          <div className="container max-w-4xl">
            {/* Breadcrumb */}
            <div className="mb-6">
              <Link href="/blog">
                <Button variant="ghost" size="sm">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Voltar para o Blog
                </Button>
              </Link>
            </div>

            {/* Categoria */}
            {category && (
              <Badge variant="secondary" className="mb-4">
                {category.name}
              </Badge>
            )}

            {/* Título */}
            <h1
              className="text-4xl md:text-5xl font-bold mb-6"
              style={{ fontFamily: "Montserrat, sans-serif" }}
            >
              {post.title}
            </h1>

            {/* Metadados */}
            <div className="flex items-center gap-6 text-sm text-gray-600 mb-8 pb-8 border-b">
              <span className="flex items-center gap-2">
                <User className="h-4 w-4" />
                Casa DF
              </span>
              <span className="flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                {format(new Date(post.publishedAt || post.createdAt), "dd 'de' MMMM 'de' yyyy", {
                  locale: ptBR,
                })}
              </span>
            </div>

            {/* Excerpt */}
            {post.excerpt && (
              <p className="text-xl text-gray-700 mb-8 leading-relaxed font-medium">{post.excerpt}</p>
            )}

            {/* Conteúdo */}
            <div
              className="prose prose-lg max-w-none mb-12"
              dangerouslySetInnerHTML={{ __html: post.content }}
              style={{
                lineHeight: "1.8",
                fontSize: "1.125rem",
              }}
            />

            {/* Compartilhamento */}
            <div className="border-t border-b py-6 mb-12">
              <div className="flex items-center gap-4">
                <span className="flex items-center gap-2 text-sm font-medium text-gray-700">
                  <Share2 className="h-4 w-4" />
                  Compartilhar:
                </span>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    asChild
                  >
                    <a
                      href={`https://www.facebook.com/sharer/sharer.php?u=${shareUrl}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label="Compartilhar no Facebook"
                    >
                      <Facebook className="h-4 w-4" />
                    </a>
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    asChild
                  >
                    <a
                      href={`https://twitter.com/intent/tweet?text=${shareTitle}&url=${shareUrl}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label="Compartilhar no Twitter"
                    >
                      <Twitter className="h-4 w-4" />
                    </a>
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    asChild
                  >
                    <a
                      href={`https://www.linkedin.com/shareArticle?mini=true&url=${shareUrl}&title=${shareTitle}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label="Compartilhar no LinkedIn"
                    >
                      <Linkedin className="h-4 w-4" />
                    </a>
                  </Button>
                </div>
              </div>
            </div>

            {/* CTA */}
            <div className="bg-gray-50 rounded-lg p-8 text-center">
              <h3 className="text-2xl font-bold mb-4" style={{ fontFamily: "Montserrat, sans-serif" }}>
                Interessado em imóveis de luxo?
              </h3>
              <p className="text-gray-600 mb-6">
                Entre em contato e encontre a mansão dos seus sonhos
              </p>
              <Button size="lg" asChild className="bg-primary hover:bg-primary/90">
                <a href="https://wa.me/5561981299575" target="_blank" rel="noopener noreferrer">
                  Fale Conosco
                </a>
              </Button>
            </div>
          </div>
        </article>
      </main>

      <Footer />
    </div>
  );
}
