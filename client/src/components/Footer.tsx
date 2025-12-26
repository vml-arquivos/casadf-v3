import { Link } from "wouter";
import { Phone, Mail, MapPin } from "lucide-react";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-foreground text-background">
      <div className="container">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 py-16">
          {/* Sobre */}
          <div>
            <h3 className="text-xl font-serif font-semibold mb-4 text-primary">
              Casa DF Imóveis
            </h3>
            <p className="text-background/70 text-sm leading-relaxed mb-4">
              Sua imobiliária de confiança em Brasília. Especializada em imóveis residenciais e comerciais com atendimento personalizado e profissional.
            </p>
            <p className="text-background/70 text-sm">
              <strong className="text-background">Localização:</strong> Guará - DF
            </p>
          </div>

          {/* Links Rápidos */}
          <div>
            <h3 className="text-xl font-serif font-semibold mb-4 text-primary">
              Links Rápidos
            </h3>
            <ul className="space-y-3">
              <li>
                <Link href="/">
                  <span className="text-background/70 hover:text-primary transition-colors text-sm cursor-pointer">
                    Home
                  </span>
                </Link>
              </li>
              <li>
                <Link href="/imoveis">
                  <span className="text-background/70 hover:text-primary transition-colors text-sm cursor-pointer">
                    Imóveis
                  </span>
                </Link>
              </li>
              <li>
                <Link href="/quem-somos">
                  <span className="text-background/70 hover:text-primary transition-colors text-sm cursor-pointer">
                    Quem Somos
                  </span>
                </Link>
              </li>
              <li>
                <Link href="/blog">
                  <span className="text-background/70 hover:text-primary transition-colors text-sm cursor-pointer">
                    Blog
                  </span>
                </Link>
              </li>
              <li>
                <Link href="/contato">
                  <span className="text-background/70 hover:text-primary transition-colors text-sm cursor-pointer">
                    Contato
                  </span>
                </Link>
              </li>
            </ul>
          </div>

          {/* Contato */}
          <div>
            <h3 className="text-xl font-serif font-semibold mb-4 text-primary">
              Contato
            </h3>
            <ul className="space-y-3">
              <li>
                <a
                  href="tel:61981488353"
                  className="flex items-start gap-3 text-background/70 hover:text-primary transition-colors text-sm"
                >
                  <Phone className="h-4 w-4 mt-0.5 flex-shrink-0" />
                  <span>(61) 98148-8353</span>
                </a>
              </li>
              <li>
                <a
                  href="https://wa.me/5561981488353"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-start gap-3 text-background/70 hover:text-primary transition-colors text-sm"
                >
                  <Phone className="h-4 w-4 mt-0.5 flex-shrink-0" />
                  <span>WhatsApp</span>
                </a>
              </li>
              <li>
                <a
                  href="mailto:contato@casadf.com.br"
                  className="flex items-start gap-3 text-background/70 hover:text-primary transition-colors text-sm"
                >
                  <Mail className="h-4 w-4 mt-0.5 flex-shrink-0" />
                  <span>contato@casadf.com.br</span>
                </a>
              </li>
              <li>
                <div className="flex items-start gap-3 text-background/70 text-sm">
                  <MapPin className="h-4 w-4 mt-0.5 flex-shrink-0" />
                  <span>Guará - Brasília/DF</span>
                </div>
              </li>
            </ul>
          </div>

          {/* Redes Sociais */}
          <div>
            <h3 className="text-xl font-serif font-semibold mb-4 text-primary">
              Redes Sociais
            </h3>
            <p className="text-background/70 text-sm mb-4">
              Acompanhe nossos imóveis e novidades nas redes sociais.
            </p>
            <div className="flex gap-4">
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-background/10 hover:bg-primary flex items-center justify-center transition-colors"
                aria-label="Instagram"
              >
                <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                </svg>
              </a>
              <a
                href="https://youtube.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-background/10 hover:bg-primary flex items-center justify-center transition-colors"
                aria-label="YouTube"
              >
                <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
                </svg>
              </a>
              <a
                href="https://tiktok.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-background/10 hover:bg-primary flex items-center justify-center transition-colors"
                aria-label="TikTok"
              >
                <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z" />
                </svg>
              </a>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-background/10 py-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-background/60">
            <p>
              © {currentYear} Casa DF Imóveis. Todos os direitos reservados.
            </p>
            <div className="flex gap-6">
              <Link href="/privacidade">
                <span className="hover:text-primary transition-colors cursor-pointer">
                  Política de Privacidade
                </span>
              </Link>
              <Link href="/termos">
                <span className="hover:text-primary transition-colors cursor-pointer">
                  Termos de Uso
                </span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
