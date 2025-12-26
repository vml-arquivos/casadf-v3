import { trpc } from "@/lib/trpc";
import { useState } from "react";
import { Link } from "wouter";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Calendar, User, Search, Tag } from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

export default function Blog() {
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  const { data: posts, isLoading: postsLoading } = trpc.blog.published.useQuery();
  const { data: categories } = trpc.blog.categories.useQuery();

  // Filtrar posts
  const filteredPosts = posts
    ? posts.filter((post) => {
        if (selectedCategory && post.categoryId !== selectedCategory) return false;
        if (searchQuery) {
          const query = searchQuery.toLowerCase();
          return (
            post.title.toLowerCase().includes(query) ||
            post.excerpt?.toLowerCase().includes(query) ||
            post.content.toLowerCase().includes(query)
          );
        }
        return true;
      })
    : [];

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Header />

      <main className="flex-1">
        {/* Hero Section */}
        <section className="bg-black text-white py-16">
          <div className="container">
            <h1 className="text-5xl font-bold mb-4" style={{ fontFamily: "Montserrat, sans-serif" }}>
              Blog
            </h1>
            <p className="text-xl text-gray-300">
              Notícias, dicas e insights sobre o mercado imobiliário de luxo
            </p>
          </div>
        </section>

        {/* Filtros e Busca */}
        <section className="py-8 bg-gray-50 border-b">
          <div className="container">
            <div className="flex flex-col md:flex-row gap-4 items-center">
              {/* Busca */}
              <div className="relative flex-1 w-full">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  type="text"
                  placeholder="Buscar posts..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>

              {/* Categorias */}
              <div className="flex gap-2 flex-wrap">
                <Button
                  variant={selectedCategory === null ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedCategory(null)}
                >
                  Todas
                </Button>
                {categories?.map((category) => (
                  <Button
                    key={category.id}
                    variant={selectedCategory === category.id ? "default" : "outline"}
                    size="sm"
                    onClick={() => setSelectedCategory(category.id)}
                  >
                    {category.name}
                  </Button>
                ))}
              </div>
            </div>

            <div className="mt-4 text-sm text-gray-600">
              {filteredPosts.length} {filteredPosts.length === 1 ? "post encontrado" : "posts encontrados"}
            </div>
          </div>
        </section>

        {/* Listagem de Posts */}
        <section className="py-12">
          <div className="container">
            {postsLoading ? (
              <div className="flex items-center justify-center py-20">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
              </div>
            ) : filteredPosts.length === 0 ? (
              <div className="text-center py-20">
                <p className="text-xl text-gray-600 mb-4">Nenhum post encontrado</p>
                {(searchQuery || selectedCategory) && (
                  <Button
                    onClick={() => {
                      setSearchQuery("");
                      setSelectedCategory(null);
                    }}
                    variant="outline"
                  >
                    Limpar Filtros
                  </Button>
                )}
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {filteredPosts.map((post) => {
                  const category = categories?.find((c) => c.id === post.categoryId);
                  return (
                    <Link key={post.id} href={`/blog/${post.slug}`}>
                      <Card className="overflow-hidden group hover:shadow-2xl transition-all duration-300 cursor-pointer h-full flex flex-col">
                        {post.featuredImage && (
                          <div
                            className="h-48 bg-cover bg-center"
                            style={{ backgroundImage: `url(${post.featuredImage})` }}
                          />
                        )}
                        <CardContent className="p-6 flex-1 flex flex-col">
                          {category && (
                            <Badge variant="secondary" className="mb-3 w-fit">
                              <Tag className="h-3 w-3 mr-1" />
                              {category.name}
                            </Badge>
                          )}

                          <h3
                            className="text-xl font-bold mb-3 line-clamp-2 group-hover:text-primary transition-colors"
                            style={{ fontFamily: "Montserrat, sans-serif" }}
                          >
                            {post.title}
                          </h3>

                          {post.excerpt && (
                            <p className="text-gray-600 text-sm mb-4 line-clamp-3 flex-1">{post.excerpt}</p>
                          )}

                          <div className="flex items-center gap-4 text-xs text-gray-500 mt-auto pt-4 border-t">
                            <span className="flex items-center gap-1">
                              <User className="h-3 w-3" />
                              Casa DF
                            </span>
                            <span className="flex items-center gap-1">
                              <Calendar className="h-3 w-3" />
                              {format(new Date(post.publishedAt || post.createdAt), "dd MMM yyyy", {
                                locale: ptBR,
                              })}
                            </span>
                          </div>
                        </CardContent>
                      </Card>
                    </Link>
                  );
                })}
              </div>
            )}
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
