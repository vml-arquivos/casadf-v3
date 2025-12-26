import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { 
  Bed, 
  Bath, 
  Maximize, 
  MapPin, 
  Car, 
  Home,
  Phone,
  Mail,
  MessageSquare,
  Share2,
  Heart,
  ChevronLeft,
  ChevronRight
} from "lucide-react";
import { Link, useParams, useLocation } from "wouter";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useState, useEffect } from "react";
import { toast } from "sonner";
import { Helmet } from "react-helmet-async";
import { formatCurrency, formatRent } from "@/lib/utils-types";

export default function PropertyDetail() {
  const params = useParams();
  const [, setLocation] = useLocation();
  const propertyId = params.id ? parseInt(params.id) : 0;
  
  const { data: property, isLoading } = trpc.properties.getById.useQuery({ id: propertyId });
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    message: `Olá! Tenho interesse no imóvel e gostaria de mais informações.`
  });

  const createLeadMutation = trpc.leads.create.useMutation({
    onSuccess: () => {
      toast.success("Mensagem enviada com sucesso! Entraremos em contato em breve.");
      setFormData({ name: "", email: "", phone: "", message: "" });
    },
    onError: () => {
      toast.error("Erro ao enviar mensagem. Tente novamente.");
    }
  });

  const images = (Array.isArray(property?.images) ? property.images : []) as string[];
  const allImages = property?.mainImage ? [property.mainImage, ...images] : images;

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % allImages.length);
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + allImages.length) % allImages.length);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    createLeadMutation.mutate({
      name: formData.name,
      email: formData.email,
      phone: formData.phone,
      notes: formData.message,
      source: "site",
      interestedPropertyId: propertyId,
    });
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: property?.title || undefined,
        text: property?.description || undefined,
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      toast.success("Link copiado para a área de transferência!");
    }
  };

  if (isLoading) {
    return (
      <>
        <Header />
        <div className="min-h-screen flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
        <Footer />
      </>
    );
  }

  if (!property) {
    return (
      <>
        <Header />
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-4xl font-bold mb-4">Imóvel não encontrado</h1>
            <Link href="/imoveis">
              <Button>Voltar para Imóveis</Button>
            </Link>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  const price = property?.salePrice 
    ? formatCurrency(property.salePrice)
    : property?.rentPrice
    ? formatRent(property.rentPrice)
    : 'Consulte';

  const fullAddress = [property.address, property.neighborhood, property.city, property.state]
    .filter((v): v is string => Boolean(v))
    .join(', ');

  // SEO Meta Tags
  const seoTitle = `${property.title} - Casa DF Corretor`;
  const seoDescription = property?.description?.substring(0, 160) || `${property?.type || 'Imóvel'} para ${property?.transactionType} em ${property?.neighborhood}, ${property?.city}. ${price}.`;
  const seoImage = property.mainImage || allImages[0] || 'https://placehold.co/1200x630';
  const seoUrl = `https://casadf.com/imovel/${property?.id}`;

  return (
    <>
      <Helmet>
        {/* Basic Meta Tags */}
        <title>{seoTitle}</title>
        <meta name="description" content={seoDescription} />
        <link rel="canonical" href={seoUrl} />

        {/* Open Graph / Facebook */}
        <meta property="og:type" content="website" />
        <meta property="og:url" content={seoUrl} />
        <meta property="og:title" content={seoTitle} />
        <meta property="og:description" content={seoDescription} />
        <meta property="og:image" content={seoImage} />

        {/* Twitter */}
        <meta property="twitter:card" content="summary_large_image" />
        <meta property="twitter:url" content={seoUrl} />
        <meta property="twitter:title" content={seoTitle} />
        <meta property="twitter:description" content={seoDescription} />
        <meta property="twitter:image" content={seoImage} />

        {/* Schema.org JSON-LD */}
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "RealEstateListing",
            "name": property.title,
            "description": property.description,
            "image": allImages,
            "address": {
              "@type": "PostalAddress",
              "streetAddress": property.address,
              "addressLocality": property.city,
              "addressRegion": property.state,
              "postalCode": property.zipCode,
              "addressCountry": "BR"
            },
            "geo": property.neighborhood ? {
              "@type": "GeoCoordinates",
              "address": fullAddress || undefined
            } : undefined,
            "offers": {
              "@type": "Offer",
              "price": property.salePrice ? property.salePrice / 100 : property.rentPrice ? property.rentPrice / 100 : 0,
              "priceCurrency": "BRL",
              "availability": property.status === 'disponivel' ? "https://schema.org/InStock" : "https://schema.org/OutOfStock"
            },
            "numberOfRooms": property.bedrooms,
            "numberOfBathroomsTotal": property.bathrooms,
            "floorSize": {
              "@type": "QuantitativeValue",
              "value": property.totalArea,
              "unitCode": "MTK"
            }
          })}
        </script>
      </Helmet>

      <Header />
      
      <div className="min-h-screen bg-background">
        {/* Gallery Section */}
        <section className="relative bg-black">
          {allImages.length > 0 ? (
            <div className="relative h-[60vh] md:h-[70vh]">
              <img
                src={allImages[currentImageIndex]}
                alt={`${property.title} - Foto ${currentImageIndex + 1}`}
                className="w-full h-full object-cover"
              />
              
              {allImages.length > 1 && (
                <>
                  <button
                    onClick={prevImage}
                    className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-3 rounded-full transition-colors"
                  >
                    <ChevronLeft className="h-6 w-6" />
                  </button>
                  <button
                    onClick={nextImage}
                    className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-3 rounded-full transition-colors"
                  >
                    <ChevronRight className="h-6 w-6" />
                  </button>
                  
                  <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/50 text-white px-4 py-2 rounded-full text-sm">
                    {currentImageIndex + 1} / {allImages.length}
                  </div>
                </>
              )}

              <div className="absolute top-4 right-4 flex gap-2">
                <Button
                  size="icon"
                  variant="secondary"
                  onClick={handleShare}
                  className="bg-white/90 hover:bg-white"
                >
                  <Share2 className="h-5 w-5" />
                </Button>
                <Button
                  size="icon"
                  variant="secondary"
                  className="bg-white/90 hover:bg-white"
                >
                  <Heart className="h-5 w-5" />
                </Button>
              </div>
            </div>
          ) : (
            <div className="h-[60vh] md:h-[70vh] bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center">
              <Home className="h-24 w-24 text-muted-foreground" />
            </div>
          )}

          {/* Thumbnail Gallery */}
          {allImages.length > 1 && (
            <div className="container py-4">
              <div className="flex gap-2 overflow-x-auto">
                {allImages.map((img: string, idx: number) => (
                  <button
                    key={idx}
                    onClick={() => setCurrentImageIndex(idx)}
                    className={`flex-shrink-0 w-24 h-24 rounded-lg overflow-hidden border-2 transition-all ${
                      idx === currentImageIndex ? 'border-primary scale-105' : 'border-transparent opacity-60 hover:opacity-100'
                    }`}
                  >
                    <img src={img} alt={`Thumbnail ${idx + 1}`} className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            </div>
          )}
        </section>

        {/* Content Section */}
        <section className="py-12">
          <div className="container">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Main Content */}
              <div className="lg:col-span-2 space-y-8">
                {/* Header */}
                <div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
                    <span className="capitalize">{property.propertyType}</span>
                    <span>•</span>
                    <span className="capitalize">{property.transactionType}</span>
                    {property.referenceCode && (
                      <>
                        <span>•</span>
                        <span>Cód: {property.referenceCode}</span>
                      </>
                    )}
                  </div>
                  <h1 className="text-4xl font-serif font-bold mb-4">{property.title}</h1>
                  <p className="text-muted-foreground flex items-center gap-2 text-lg">
                    <MapPin className="h-5 w-5" />
                    {fullAddress}
                  </p>
                  <div className="text-4xl font-bold text-primary mt-4">{price}</div>
                </div>

                {/* Features */}
                <Card>
                  <CardContent className="p-6">
                    <h2 className="text-2xl font-bold mb-4">Características</h2>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                      {property.bedrooms && (
                        <div className="flex items-center gap-3">
                          <div className="p-3 rounded-lg bg-primary/10">
                            <Bed className="h-6 w-6 text-primary" />
                          </div>
                          <div>
                            <div className="font-semibold">{property.bedrooms}</div>
                            <div className="text-sm text-muted-foreground">Quartos</div>
                          </div>
                        </div>
                      )}
                      {property.bathrooms && (
                        <div className="flex items-center gap-3">
                          <div className="p-3 rounded-lg bg-primary/10">
                            <Bath className="h-6 w-6 text-primary" />
                          </div>
                          <div>
                            <div className="font-semibold">{property.bathrooms}</div>
                            <div className="text-sm text-muted-foreground">Banheiros</div>
                          </div>
                        </div>
                      )}
                      {property.totalArea && (
                        <div className="flex items-center gap-3">
                          <div className="p-3 rounded-lg bg-primary/10">
                            <Maximize className="h-6 w-6 text-primary" />
                          </div>
                          <div>
                            <div className="font-semibold">{property.totalArea}m²</div>
                            <div className="text-sm text-muted-foreground">Área Total</div>
                          </div>
                        </div>
                      )}
                      {property.parkingSpaces && (
                        <div className="flex items-center gap-3">
                          <div className="p-3 rounded-lg bg-primary/10">
                            <Car className="h-6 w-6 text-primary" />
                          </div>
                          <div>
                            <div className="font-semibold">{property.parkingSpaces}</div>
                            <div className="text-sm text-muted-foreground">Vagas</div>
                          </div>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>

                {/* Description */}
                {property.description && (
                  <Card>
                    <CardContent className="p-6">
                      <h2 className="text-2xl font-bold mb-4">Descrição</h2>
                      <p className="text-muted-foreground whitespace-pre-line leading-relaxed">
                        {property.description}
                      </p>
                    </CardContent>
                  </Card>
                )}

                {/* Map Placeholder */}
                <Card>
                  <CardContent className="p-6">
                    <h2 className="text-2xl font-bold mb-4">Localização</h2>
                    <div className="h-64 bg-muted rounded-lg flex items-center justify-center">
                      <div className="text-center text-muted-foreground">
                        <MapPin className="h-12 w-12 mx-auto mb-2" />
                        <p>{fullAddress}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Sidebar - Contact Form */}
              <div className="lg:col-span-1">
                <Card className="sticky top-4">
                  <CardContent className="p-6">
                    <h2 className="text-2xl font-bold mb-4">Tenho Interesse</h2>
                    <p className="text-muted-foreground mb-6">
                      Preencha o formulário e entraremos em contato
                    </p>

                    <form onSubmit={handleSubmit} className="space-y-4">
                      <div>
                        <Label htmlFor="name">Nome *</Label>
                        <Input
                          id="name"
                          value={formData.name}
                          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                          required
                        />
                      </div>

                      <div>
                        <Label htmlFor="email">E-mail *</Label>
                        <Input
                          id="email"
                          type="email"
                          value={formData.email}
                          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                          required
                        />
                      </div>

                      <div>
                        <Label htmlFor="phone">Telefone *</Label>
                        <Input
                          id="phone"
                          value={formData.phone}
                          onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                          required
                        />
                      </div>

                      <div>
                        <Label htmlFor="message">Mensagem</Label>
                        <Textarea
                          id="message"
                          rows={4}
                          value={formData.message}
                          onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                        />
                      </div>

                      <Button type="submit" className="w-full" disabled={createLeadMutation.isPending}>
                        {createLeadMutation.isPending ? "Enviando..." : "Enviar Mensagem"}
                      </Button>
                    </form>

                    <div className="mt-6 pt-6 border-t space-y-3">
                      <a href="tel:+556132544464" className="flex items-center gap-3 text-muted-foreground hover:text-foreground transition-colors">
                        <Phone className="h-5 w-5" />
                        <span>(61) 3254-4464</span>
                      </a>
                      <a href="mailto:casadfsimiao@hotmail.com" className="flex items-center gap-3 text-muted-foreground hover:text-foreground transition-colors">
                        <Mail className="h-5 w-5" />
                        <span>casadfsimiao@hotmail.com</span>
                      </a>
                      <a href="https://wa.me/5561999999999" target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 text-green-600 hover:text-green-700 transition-colors">
                        <MessageSquare className="h-5 w-5" />
                        <span>WhatsApp</span>
                      </a>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </section>
      </div>

      <Footer />
    </>
  );
}
