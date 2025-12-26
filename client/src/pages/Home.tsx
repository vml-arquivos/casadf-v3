import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, Bed, Bath, Maximize, MapPin, TrendingUp, Award, Users } from "lucide-react";
import { Link, useLocation } from "wouter";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { trpc } from "@/lib/trpc";
import { formatCurrency, formatRent } from "@/lib/utils-types";
import { Star } from "lucide-react";

function FeaturedProperties() {
  const { data: properties, isLoading } = trpc.properties.featured.useQuery({ limit: 6 });

  if (isLoading) {
    return (
      <section className="py-20 bg-background">
        <div className="container">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-20 bg-background">
      <div className="container">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-serif font-bold mb-4" style={{fontFamily: 'montserrat'}}>Imóveis em Destaque</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Seleção exclusiva de propriedades de alto padrão
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {properties && properties.length > 0 ? (
            properties.map((property) => (
              <Link key={property.id} href={`/imovel/${property.id}`}>
                <Card className="overflow-hidden group hover:shadow-2xl transition-shadow duration-300 cursor-pointer">
                <div className="relative h-64 bg-muted overflow-hidden">
                  {(() => {
                    const imageUrl = property.mainImage || (property.images ? JSON.parse(property.images)[0]?.url : null);
                    return imageUrl ? (
                      <img 
                        src={imageUrl} 
                        alt={property.title}
                        className="w-full h-full object-cover"
                        loading="lazy"
                      />
                    ) : (
                      <div className="w-full h-full" style={{background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'}} />
                    );
                  })()}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                  <div className="absolute bottom-4 left-4 text-white">
                    <span className="text-2xl font-serif font-bold">
                      {property.salePrice
                        ? formatCurrency(property.salePrice)
                        : property.rentPrice
                        ? formatRent(property.rentPrice)
                        : 'Consulte'}
                    </span>
                  </div>
                </div>
                <CardContent className="p-6">
                  <h3 className="text-xl font-serif font-bold mb-2">{property.title}</h3>
                  <p className="text-muted-foreground text-sm mb-4 flex items-center gap-1">
                    <MapPin className="h-4 w-4" />
                    {property.neighborhood}, {property.city}
                  </p>
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    {property.bedrooms && (
                      <span className="flex items-center gap-1">
                        <Bed className="h-4 w-4" /> {property.bedrooms}
                      </span>
                    )}
                    {property.bathrooms && (
                      <span className="flex items-center gap-1">
                        <Bath className="h-4 w-4" /> {property.bathrooms}
                      </span>
                    )}
                    {property.totalArea && (
                      <span className="flex items-center gap-1">
                        <Maximize className="h-4 w-4" /> {property.totalArea}m²
                      </span>
                    )}
                  </div>
                </CardContent>
              </Card>
              </Link>
            ))
          ) : (
            <div className="col-span-3 text-center py-12">
              <p className="text-muted-foreground">Nenhum imóvel em destaque no momento</p>
            </div>
          )}
        </div>

        <div className="text-center mt-12">
          <Link href="/imoveis">
            <Button size="lg" variant="outline" className="border-primary text-primary hover:bg-primary hover:text-primary-foreground">
              Ver Todos os Imóveis
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}

function AllProperties() {
  const { data: properties, isLoading } = trpc.properties.list.useQuery();
  const availableProperties = properties?.filter(p => p.status === 'disponivel') || [];

  if (isLoading) {
    return (
      <section className="py-20 bg-muted/30">
        <div className="container">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          </div>
        </div>
      </section>
    );
  }

  if (availableProperties.length === 0) {
    return null;
  }

  return (
    <section className="py-20 bg-muted/30">
      <div className="container">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-serif font-bold mb-4" style={{fontFamily: 'montserrat'}}>Todos os Imóveis Disponíveis</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Confira nosso portfólio completo de imóveis de alto padrão
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {availableProperties.slice(0, 9).map((property) => (
            <Link key={property.id} href={`/imovel/${property.id}`}>
              <Card className="overflow-hidden group hover:shadow-2xl transition-shadow duration-300 cursor-pointer">
              <div className="relative h-64 bg-muted overflow-hidden">
                {(() => {
                  const imageUrl = property.mainImage || (property.images ? JSON.parse(property.images)[0]?.url : null);
                  return imageUrl ? (
                    <img 
                      src={imageUrl} 
                      alt={property.title}
                      className="w-full h-full object-cover"
                      loading="lazy"
                    />
                  ) : (
                    <div className="w-full h-full" style={{background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'}} />
                  );
                })()}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                <div className="absolute bottom-4 left-4 text-white">
                  <span className="text-2xl font-serif font-bold">
                    {property.salePrice
                      ? formatCurrency(property.salePrice)
                      : property.rentPrice
                      ? formatRent(property.rentPrice)
                      : 'Consulte'}
                  </span>
                </div>
              </div>
              <CardContent className="p-6">
                <h3 className="text-xl font-serif font-bold mb-2">{property.title}</h3>
                <p className="text-muted-foreground text-sm mb-4 flex items-center gap-1">
                  <MapPin className="h-4 w-4" />
                  {property.neighborhood}, {property.city}
                </p>
                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                  {property.bedrooms && (
                    <span className="flex items-center gap-1">
                      <Bed className="h-4 w-4" /> {property.bedrooms}
                    </span>
                  )}
                  {property.bathrooms && (
                    <span className="flex items-center gap-1">
                      <Bath className="h-4 w-4" /> {property.bathrooms}
                    </span>
                  )}
                  {property.totalArea && (
                    <span className="flex items-center gap-1">
                      <Maximize className="h-4 w-4" /> {property.totalArea}m²
                    </span>
                  )}
                </div>
              </CardContent>
            </Card>
            </Link>
          ))}
        </div>

        {availableProperties.length > 9 && (
          <div className="text-center mt-12">
            <Link href="/imoveis">
              <Button size="lg" variant="outline" className="border-primary text-primary hover:bg-primary hover:text-primary-foreground">
                Ver Todos os {availableProperties.length} Imóveis
              </Button>
            </Link>
          </div>
        )}
      </div>
    </section>
  );
}

function ReviewsSection() {
  const { data: reviews, isLoading } = trpc.reviews.list.useQuery();

  if (isLoading) {
    return (
      <section className="py-20 bg-background">
        <div className="container">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          </div>
        </div>
      </section>
    );
  }

  if (!reviews || reviews.length === 0) {
    return null;
  }

  return (
    <section className="py-20 bg-muted/30">
      <div className="container">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-serif font-bold mb-4" style={{fontFamily: 'montserrat'}}>O Que Dizem Nossos Clientes</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Depoimentos reais de clientes satisfeitos com nosso atendimento
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {reviews.slice(0, 3).map((review) => (
            <Card key={review.id} className="hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-center gap-1 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`h-5 w-5 ${
                        i < review.rating
                          ? 'fill-yellow-400 text-yellow-400'
                          : 'text-gray-300'
                      }`}
                    />
                  ))}
                </div>
                {review.title && (
                  <h3 className="text-lg font-bold mb-2">{review.title}</h3>
                )}
                <p className="text-muted-foreground mb-6 line-clamp-4">
                  {review.content}
                </p>
                <div className="flex items-center gap-3">
                  {review.clientPhoto && (
                    <img
                      src={review.clientPhoto}
                      alt={review.clientName}
                      className="w-12 h-12 rounded-full object-cover"
                    />
                  )}
                  <div>
                    <p className="font-semibold">{review.clientName}</p>
                    {review.clientRole && (
                      <p className="text-sm text-muted-foreground">{review.clientRole}</p>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}

function BlogSection() {
  const { data: posts, isLoading } = trpc.blog.published.useQuery({ limit: 3 });

  if (isLoading) {
    return (
      <section className="py-20 bg-background">
        <div className="container">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          </div>
        </div>
      </section>
    );
  }

  if (!posts || posts.length === 0) {
    return null;
  }

  return (
    <section className="py-20 bg-background">
      <div className="container">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-serif font-bold mb-4" style={{fontFamily: 'montserrat'}}>Blog Imobiliário</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Dicas, tendências e novidades do mercado de luxo
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {posts.map((post) => (
            <Link key={post.id} href={`/blog/${post.slug}`}>
              <Card className="overflow-hidden hover:shadow-lg transition-shadow cursor-pointer h-full">
                <div 
                  className="h-48 bg-gradient-to-br from-primary/20 to-primary/5 bg-cover bg-center"
                  style={{
                    backgroundImage: post.featuredImage ? `url(${post.featuredImage})` : undefined
                  }}
                />
                <CardContent className="p-6">
                  <p className="text-sm text-muted-foreground mb-2">
                    {post.publishedAt ? new Date(post.publishedAt).toLocaleDateString('pt-BR', {
                      day: 'numeric',
                      month: 'long',
                      year: 'numeric'
                    }) : 'Recente'}
                  </p>
                  <h3 className="text-xl font-bold mb-2 line-clamp-2">{post.title}</h3>
                  {post.excerpt && (
                    <p className="text-muted-foreground text-sm mb-4 line-clamp-3">
                      {post.excerpt}
                    </p>
                  )}
                  <Button variant="link" className="p-0">Ler mais →</Button>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>

        <div className="text-center mt-12">
          <Link href="/blog">
            <Button size="lg" variant="outline" className="border-primary text-primary hover:bg-primary hover:text-primary-foreground">
              Ver Todos os Artigos
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}

export default function Home() {
  const [, setLocation] = useLocation();
  const [searchParams, setSearchParams] = useState({
    transactionType: '',
    propertyType: '',
    neighborhood: '',
  });
  
  // Buscar configurações do site
  const { data: settings } = trpc.settings.get.useQuery();

  // Ler query params da URL ao carregar
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    setSearchParams({
      transactionType: params.get("finalidade") || "",
      propertyType: params.get("tipo") || "",
      neighborhood: params.get("bairro") || "",
    });
  }, []);

  const handleSearch = () => {
    const params = new URLSearchParams();
    if (searchParams.transactionType) params.set("finalidade", searchParams.transactionType);
    if (searchParams.propertyType) params.set("tipo", searchParams.propertyType);
    if (searchParams.neighborhood) params.set("bairro", searchParams.neighborhood);
    
    const queryString = params.toString();
    setLocation(`/imoveis${queryString ? `?${queryString}` : ""}`);
  };

  return (
    <>
      <Header />
      
      {/* Hero Section */}
      <section 
        className={`relative h-screen flex items-center justify-center bg-black ${
          settings?.themeStyle === 'classic' ? 'py-20' : ''
        }`}
      >
        <div 
          className="absolute inset-0 bg-cover bg-center"
          style={{ 
            backgroundImage: `url(${settings?.heroBackgroundImage || '/hero-mansion.jpg'})` 
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/70 to-black/50" />
        
        <div className={`relative z-10 text-center text-white ${
          settings?.themeStyle === 'classic' ? 'container' : 'container'
        }`}>
          <h1 className="text-5xl md:text-7xl font-bold mb-6" style={{ fontFamily: 'Montserrat, sans-serif', fontSize: '61px' }}>
            {settings?.heroTitle || 'Encontre Seu Imóvel em Brasília'}
          </h1>
          <p className="text-xl md:text-2xl mb-12 max-w-3xl mx-auto">
            {settings?.heroSubtitle || 'A Casa DF Imóveis oferece as melhores opções de imóveis em Brasília e região. Encontre seu lar ideal com nosso atendimento especializado.'}
          </p>

          {/* Search Bar */}
          <Card className="max-w-4xl mx-auto bg-white/95 backdrop-blur-sm">
            <CardContent className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                <Select
                  value={searchParams.transactionType}
                  onValueChange={(value) => setSearchParams(prev => ({ ...prev, transactionType: value }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Finalidade" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="venda">Venda</SelectItem>
                    <SelectItem value="locacao">Locação</SelectItem>
                    <SelectItem value="ambos">Ambos</SelectItem>
                  </SelectContent>
                </Select>

                <Select
                  value={searchParams.propertyType}
                  onValueChange={(value) => setSearchParams(prev => ({ ...prev, propertyType: value }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Tipo de Imóvel" />
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

                <Select
                  value={searchParams.neighborhood}
                  onValueChange={(value) => setSearchParams(prev => ({ ...prev, neighborhood: value }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Bairro" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Lago Sul">Lago Sul</SelectItem>
                    <SelectItem value="Lago Norte">Lago Norte</SelectItem>
                    <SelectItem value="Sudoeste">Sudoeste</SelectItem>
                    <SelectItem value="Noroeste">Noroeste</SelectItem>
                    <SelectItem value="Park Way">Park Way</SelectItem>
                    <SelectItem value="Asa Sul">Asa Sul</SelectItem>
                    <SelectItem value="Asa Norte">Asa Norte</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <Button 
                className="w-full bg-primary hover:bg-primary/90 text-primary-foreground" 
                size="lg"
                onClick={handleSearch}
              >
                <Search className="mr-2 h-5 w-5" />
                Buscar Imóveis
              </Button>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Estatísticas */}
      <section className="py-16 bg-muted/30">
        <div className="container">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-4">
                <TrendingUp className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-4xl font-serif font-bold mb-2" style={{fontFamily: 'poppins'}}>15+</h3>
              <p className="text-muted-foreground">Anos de Experiência</p>
            </div>
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-4">
                <Award className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-4xl font-serif font-bold mb-2" style={{fontFamily: 'poppins'}}>500+</h3>
              <p className="text-muted-foreground">Imóveis Vendidos</p>
            </div>
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-4">
                <Users className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-4xl font-serif font-bold mb-2" style={{fontFamily: 'poppins'}}>1000+</h3>
              <p className="text-muted-foreground">Clientes Satisfeitos</p>
            </div>
          </div>
        </div>
      </section>

      {/* Imóveis em Destaque */}
      <FeaturedProperties />

      {/* Todos os Imóveis */}
      <AllProperties />

      {/* Seção de Blog */}
      <BlogSection />

      {/* Avaliações de Clientes */}
      <ReviewsSection />

      {/* Sobre o Corretor */}
      <section className={`py-20 bg-muted/30 ${
        settings?.themeStyle === 'classic' ? '' : ''
      }`}>
        <div className={settings?.themeStyle === 'classic' ? 'container max-w-6xl mx-auto' : 'container'}>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-4xl font-serif font-bold mb-6">
                {settings?.aboutSectionTitle || 'Casa DF Imóveis'}
              </h2>
              <div className="text-lg text-muted-foreground mb-6 whitespace-pre-line">
                {settings?.aboutSectionContent || 'Sua imobiliária de confiança em Brasília. Especializada em imóveis residenciais e comerciais com atendimento personalizado e profissional.\n\nA Casa DF Imóveis oferece soluções completas para compra, venda e locação de imóveis em Brasília e região. Nossa equipe está pronta para te ajudar a encontrar o imóvel ideal, com transparência, agilidade e segurança em todas as etapas.'}
              </div>
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="flex items-center gap-2">
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                    <svg className="w-6 h-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div>
                    <p className="font-semibold">Atendimento 24/7</p>
                    <p className="text-sm text-muted-foreground">Suporte completo</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                    <svg className="w-6 h-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div>
                    <p className="font-semibold">Melhores Preços</p>
                    <p className="text-sm text-muted-foreground">Negociação justa</p>
                  </div>
                </div>
              </div>
              <Link href="/quem-somos">
                <Button size="lg">Conheça Mais</Button>
              </Link>
            </div>
            <div className="relative h-96 lg:h-full min-h-[400px] rounded-lg overflow-hidden">
              {settings?.aboutSectionImage ? (
                <img 
                  src={settings.aboutSectionImage} 
                  alt="Sobre Casa DF"
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center h-full">
                  <div className="text-center p-8">
                    <div className="w-32 h-32 mx-auto mb-6 rounded-full bg-white/90 flex items-center justify-center">
                      <svg className="w-20 h-20 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                      </svg>
                    </div>
                    <h3 className="text-3xl font-bold text-primary mb-2">CASA DF</h3>
                    <p className="text-lg text-muted-foreground">Imóveis em Brasília</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </>
  );
}
