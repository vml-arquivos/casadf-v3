import { Helmet } from "react-helmet-async";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  Award, 
  Building2, 
  Users, 
  TrendingUp, 
  Phone, 
  Mail,
  MapPin,
  CheckCircle2,
  Star,
  Home,
  Shield,
  Target
} from "lucide-react";

export default function About() {
  const achievements = [
    { icon: Building2, value: "300+", label: "Imóveis Disponíveis" },
    { icon: Users, value: "500+", label: "Clientes Satisfeitos" },
    { icon: TrendingUp, value: "R$ 500M+", label: "Em Transações" },
    { icon: Award, value: "10+", label: "Anos no Mercado" },
  ];

  const values = [
    {
      icon: Shield,
      title: "Confiança e Segurança",
      description: "Trabalhamos com total transparência em todas as etapas da negociação, garantindo segurança jurídica e documental em cada transação.",
    },
    {
      icon: Target,
      title: "Foco no Cliente",
      description: "Entendemos suas necessidades e encontramos o imóvel ideal que se encaixa no seu perfil, orçamento e estilo de vida.",
    },
    {
      icon: Home,
      title: "Expertise Local",
      description: "Conhecimento profundo do mercado imobiliário de Brasília e região, com especialização em todos os bairros e regiões administrativas.",
    },
    {
      icon: Star,
      title: "Atendimento Personalizado",
      description: "Cada cliente recebe atenção dedicada e consultoria especializada, do primeiro contato até a entrega das chaves.",
    },
  ];

  const services = [
    "Compra e Venda de Imóveis Residenciais",
    "Locação de Imóveis Comerciais e Residenciais",
    "Consultoria Imobiliária Completa",
    "Avaliação de Imóveis",
    "Assessoria Jurídica e Documental",
    "Financiamento e Crédito Imobiliário",
    "Gestão de Imóveis para Investidores",
    "Marketing Digital de Imóveis",
  ];

  const testimonials = [
    {
      name: "Maria Silva",
      role: "Compradora - Lago Sul",
      text: "A Casa DF foi fundamental na compra do meu apartamento. Atendimento impecável e total suporte em todo o processo!",
      rating: 5,
    },
    {
      name: "João Santos",
      role: "Investidor - Águas Claras",
      text: "Excelente assessoria para investimento. Encontrei imóveis com ótimo potencial de valorização graças à equipe da Casa DF.",
      rating: 5,
    },
    {
      name: "Ana Paula",
      role: "Locatária - Asa Sul",
      text: "Processo de locação super rápido e sem burocracia. Recomendo a Casa DF para quem busca agilidade e profissionalismo.",
      rating: 5,
    },
  ];

  return (
    <>
      <Helmet>
        <title>Quem Somos - Casa DF Imóveis | Imobiliária em Brasília</title>
        <meta 
          name="description" 
          content="Conheça a Casa DF Imóveis, sua imobiliária de confiança em Brasília. Especializada em compra, venda e locação de imóveis com atendimento personalizado." 
        />
        <meta property="og:title" content="Quem Somos - Casa DF Imóveis | Imobiliária em Brasília" />
        <meta property="og:description" content="Conheça a Casa DF Imóveis, sua imobiliária de confiança em Brasília." />
        <meta property="og:type" content="website" />
      </Helmet>

      <Header />

      {/* Hero Section */}
      <section className="relative py-20 bg-gradient-to-br from-primary/10 to-primary/5">
        <div className="container">
          <div className="max-w-4xl mx-auto text-center">
            <Badge className="mb-4" variant="secondary">
              Sobre Nós
            </Badge>
            <h1 className="text-5xl md:text-6xl font-bold mb-6">
              Casa DF Imóveis
            </h1>
            <p className="text-xl text-muted-foreground mb-8">
              Sua imobiliária de confiança em Brasília. Especializada em soluções completas para compra, venda e locação de imóveis residenciais e comerciais.
            </p>
          </div>
        </div>
      </section>

      {/* Achievements */}
      <section className="py-16 bg-background">
        <div className="container">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {achievements.map((achievement, index) => {
              const Icon = achievement.icon;
              return (
                <Card key={index} className="text-center">
                  <CardContent className="pt-6">
                    <Icon className="w-12 h-12 mx-auto mb-4 text-primary" />
                    <h3 className="text-3xl font-bold mb-2">{achievement.value}</h3>
                    <p className="text-sm text-muted-foreground">{achievement.label}</p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Nossa História */}
      <section className="py-20 bg-muted/30">
        <div className="container">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-4xl font-bold mb-8 text-center">Nossa História</h2>
            <div className="space-y-6 text-lg text-muted-foreground">
              <p>
                A <strong className="text-foreground">Casa DF Imóveis</strong> nasceu com o propósito de transformar a experiência de compra, venda e locação de imóveis em Brasília. Fundada por profissionais experientes do mercado imobiliário, nossa missão é oferecer um atendimento diferenciado, transparente e focado nas necessidades de cada cliente.
              </p>
              <p>
                Ao longo dos anos, construímos uma sólida reputação baseada em confiança, profissionalismo e resultados concretos. Atendemos clientes em todas as regiões de Brasília e Entorno, desde quem busca sua primeira casa até investidores que desejam expandir seu portfólio imobiliário.
              </p>
              <p>
                Nossa equipe é formada por corretores qualificados, consultores especializados e profissionais de marketing digital, todos comprometidos em oferecer a melhor experiência possível. Utilizamos tecnologia de ponta para facilitar a busca por imóveis e garantir processos ágeis e seguros.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Nossos Valores */}
      <section className="py-20 bg-background">
        <div className="container">
          <h2 className="text-4xl font-bold mb-12 text-center">Nossos Valores</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, index) => {
              const Icon = value.icon;
              return (
                <Card key={index}>
                  <CardContent className="pt-6">
                    <Icon className="w-12 h-12 mb-4 text-primary" />
                    <h3 className="text-xl font-bold mb-3">{value.title}</h3>
                    <p className="text-muted-foreground">{value.description}</p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Nossos Serviços */}
      <section className="py-20 bg-muted/30">
        <div className="container">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-4xl font-bold mb-12 text-center">Nossos Serviços</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {services.map((service, index) => (
                <div key={index} className="flex items-start gap-3">
                  <CheckCircle2 className="w-6 h-6 text-primary flex-shrink-0 mt-1" />
                  <p className="text-lg">{service}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Depoimentos */}
      <section className="py-20 bg-background">
        <div className="container">
          <h2 className="text-4xl font-bold mb-12 text-center">O Que Nossos Clientes Dizem</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <Card key={index}>
                <CardContent className="pt-6">
                  <div className="flex gap-1 mb-4">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="w-5 h-5 fill-primary text-primary" />
                    ))}
                  </div>
                  <p className="text-muted-foreground mb-4 italic">"{testimonial.text}"</p>
                  <div>
                    <p className="font-semibold">{testimonial.name}</p>
                    <p className="text-sm text-muted-foreground">{testimonial.role}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Final */}
      <section className="py-20 bg-primary text-primary-foreground">
        <div className="container">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-4xl font-bold mb-6">Pronto para Encontrar Seu Imóvel Ideal?</h2>
            <p className="text-xl mb-8 opacity-90">
              Entre em contato conosco e descubra como podemos te ajudar a realizar seu sonho!
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" variant="secondary" asChild>
                <a href="https://wa.me/5561981488353" target="_blank" rel="noopener noreferrer">
                  <Phone className="w-5 h-5 mr-2" />
                  Fale Conosco
                </a>
              </Button>
              <Button size="lg" variant="outline" asChild className="bg-transparent border-primary-foreground text-primary-foreground hover:bg-primary-foreground hover:text-primary">
                <a href="mailto:contato@casadf.com.br">
                  <Mail className="w-5 h-5 mr-2" />
                  Enviar Email
                </a>
              </Button>
            </div>
            <div className="mt-8 flex items-center justify-center gap-2 text-sm opacity-80">
              <MapPin className="w-4 h-4" />
              <span>Guará - Brasília/DF</span>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </>
  );
}
