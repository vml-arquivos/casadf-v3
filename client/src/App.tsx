import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/NotFound";
import { Route, Switch } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import { trpc } from "@/lib/trpc";
import { useEffect } from "react";

import AdminLayout from "./components/AdminLayout";
import CompareBar from "./components/CompareBar";
import Home from "./pages/Home";
import PropertyDetailPage from "./pages/PropertyDetail";
import BlogPosts from "./pages/admin/BlogPosts";
import BlogPostEdit from "./pages/admin/BlogPostEdit";
import Properties from "./pages/Properties";
import Blog from "./pages/Blog";
import BlogPost from "./pages/BlogPost";
import About from "./pages/About";
import CompareProperties from "./pages/CompareProperties";
import Dashboard from "./pages/admin/Dashboard";
import PropertiesAdmin from "./pages/admin/Properties";
import PropertyEdit from "./pages/admin/PropertyEdit";
import PropertyNew from "./pages/admin/PropertyNew";
import LeadsAdmin from "./pages/admin/Leads";
import LeadEdit from "./pages/admin/LeadEdit";
import ClientManagement from "./pages/admin/ClientManagement";
import FollowUp from "./pages/admin/FollowUp";
import Analytics from "./pages/admin/Analytics";
import TestImageUpload from "./pages/TestImageUpload";
import SalesFunnel from "./pages/admin/SalesFunnel";
import FinancingSimulator from "./pages/FinancingSimulator";
import SiteCustomization from "./pages/admin/SiteCustomization";
import FinancialDashboardDemo from "./pages/admin/FinancialDashboardDemo";
import OwnerPortal from "./pages/OwnerPortal";

function Router() {
  return (
    <Switch>
      {/* Public routes */}
      <Route path={"/"} component={Home} />
      <Route path="/imoveis" component={Properties} />
      <Route path="/imovel/:id" component={PropertyDetailPage} />
      <Route path="/blog" component={Blog} />
      <Route path="/blog/:slug" component={BlogPost} />
      <Route path="/quem-somos" component={About} />
      <Route path="/comparar-imoveis" component={CompareProperties} />
      <Route path="/simulador-financiamento" component={FinancingSimulator} />
      <Route path="/test-upload" component={TestImageUpload} />
      
      {/* Admin routes */}
      <Route path="/admin/analytics">
        {() => (
          <AdminLayout>
            <Analytics />
          </AdminLayout>
        )}
      </Route>
      <Route path="/admin">
        {() => (
          <AdminLayout>
            <Dashboard />
          </AdminLayout>
        )}
      </Route>
      <Route path="/admin/properties">
        {() => (
          <AdminLayout>
            <PropertiesAdmin />
          </AdminLayout>
        )}
      </Route>
      <Route path="/admin/properties/new">
        {() => (
          <AdminLayout>
            <PropertyNew />
          </AdminLayout>
        )}
      </Route>
      <Route path="/admin/properties/:id">
        {(params) => <PropertyEdit />}
      </Route>
      <Route path="/admin/funil">
        {() => (
          <AdminLayout>
            <SalesFunnel />
          </AdminLayout>
        )}
      </Route>
      <Route path="/admin/leads">
        {() => (
          <AdminLayout>
            <LeadsAdmin />
          </AdminLayout>
        )}
      </Route>
      <Route path="/admin/leads/new">
        {() => <LeadEdit />}
      </Route>
      <Route path="/imovel/:id">
        {(params) => <PropertyDetailPage />}
      </Route>
      <Route path="/admin/clients">
        {() => (
          <AdminLayout>
            <ClientManagement />
          </AdminLayout>
        )}
      </Route>
      <Route path="/admin/blog">
        {() => (
          <AdminLayout>
            <BlogPosts />
          </AdminLayout>
        )}
      </Route>
      <Route path="/admin/blog/new">
        {() => (
          <AdminLayout>
            <BlogPostEdit />
          </AdminLayout>
        )}
      </Route>
      <Route path="/admin/blog/:id/edit">
        {() => (
          <AdminLayout>
            <BlogPostEdit />
          </AdminLayout>
        )}
      </Route>
      <Route path="/admin/followup">
        {() => (
          <AdminLayout>
            <FollowUp />
          </AdminLayout>
        )}
      </Route>
      <Route path="/admin/customization">
        {() => (
          <AdminLayout>
            <SiteCustomization />
          </AdminLayout>
        )}
      </Route>
      <Route path="/admin/financial">
        {() => (
          <AdminLayout>
            <FinancialDashboardDemo />
          </AdminLayout>
        )}
      </Route>
      <Route path="/proprietario">
        {() => <OwnerPortal />}
      </Route>
      
      <Route path={"/404"} component={NotFound} />
      {/* Final fallback route */}
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  // Buscar configurações do site para aplicar cor primária
  const { data: settings } = trpc.settings.get.useQuery();

  // Aplicar cor primária dinamicamente
  useEffect(() => {
    if (settings?.primaryColor) {
      // Aplicar cor primária como variável CSS global
      document.documentElement.style.setProperty('--primary', settings.primaryColor);
      
      // Converter hex para HSL para as variáveis do Shadcn/UI
      const hexToHSL = (hex: string) => {
        const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
        if (!result) return null;
        
        let r = parseInt(result[1], 16) / 255;
        let g = parseInt(result[2], 16) / 255;
        let b = parseInt(result[3], 16) / 255;
        
        const max = Math.max(r, g, b);
        const min = Math.min(r, g, b);
        let h = 0, s = 0, l = (max + min) / 2;
        
        if (max !== min) {
          const d = max - min;
          s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
          
          switch (max) {
            case r: h = ((g - b) / d + (g < b ? 6 : 0)) / 6; break;
            case g: h = ((b - r) / d + 2) / 6; break;
            case b: h = ((r - g) / d + 4) / 6; break;
          }
        }
        
        return {
          h: Math.round(h * 360),
          s: Math.round(s * 100),
          l: Math.round(l * 100)
        };
      };
      
      const hsl = hexToHSL(settings.primaryColor);
      if (hsl) {
        document.documentElement.style.setProperty('--primary', `${hsl.h} ${hsl.s}% ${hsl.l}%`);
      }
    }
  }, [settings?.primaryColor]);

  return (
    <ErrorBoundary>
      <ThemeProvider defaultTheme="light">
        <TooltipProvider>
          <Toaster />
          <Router />
          <CompareBar />
        </TooltipProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
