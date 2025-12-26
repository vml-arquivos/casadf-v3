import { int, mysqlEnum, mysqlTable, text, timestamp, varchar, boolean, decimal, json, date } from "drizzle-orm/mysql-core";

/**
 * Schema completo para o sistema Casa DF
 * Inclui: usuários, imóveis, leads, interações, blog, configurações
 */

// ============================================
// TABELA DE USUÁRIOS (AUTH)
// ============================================

export const users = mysqlTable("users", {
  id: int("id").autoincrement().primaryKey(),
  openId: varchar("openId", { length: 64 }).unique(), // Nullable para compatibilidade com auth local
  name: text("name").notNull(),
  email: varchar("email", { length: 320 }).notNull().unique(),
  password: varchar("password", { length: 255 }), // Hash da senha (bcrypt/scrypt)
  loginMethod: varchar("loginMethod", { length: 64 }).default("local"),
  role: mysqlEnum("role", ["user", "admin"]).default("user").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  lastSignedIn: timestamp("lastSignedIn").defaultNow().notNull(),
});

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;

// ============================================
// TABELA DE IMÓVEIS
// ============================================

export const properties = mysqlTable("properties", {
  id: int("id").autoincrement().primaryKey(),
  
  // Informações básicas
  title: varchar("title", { length: 255 }).notNull(),
  description: text("description"),
  referenceCode: varchar("referenceCode", { length: 50 }).unique(),
  
  // Tipo e finalidade
  propertyType: mysqlEnum("propertyType", [
    "casa",
    "apartamento",
    "cobertura",
    "terreno",
    "comercial",
    "rural",
    "lancamento"
  ]).notNull(),
  transactionType: mysqlEnum("transactionType", ["venda", "locacao", "ambos"]).notNull(),
  
  // Localização
  address: varchar("address", { length: 255 }),
  neighborhood: varchar("neighborhood", { length: 100 }),
  city: varchar("city", { length: 100 }),
  state: varchar("state", { length: 2 }),
  zipCode: varchar("zipCode", { length: 10 }),
  latitude: varchar("latitude", { length: 50 }),
  longitude: varchar("longitude", { length: 50 }),
  
  // Valores
  salePrice: int("salePrice"), // em centavos
  rentPrice: int("rentPrice"), // em centavos
  condoFee: int("condoFee"), // em centavos
  iptu: int("iptu"), // em centavos (anual)
  
  // Características
  bedrooms: int("bedrooms"),
  bathrooms: int("bathrooms"),
  suites: int("suites"),
  parkingSpaces: int("parkingSpaces"),
  totalArea: int("totalArea"), // em m²
  builtArea: int("builtArea"), // em m²
  
  // Características adicionais (JSON)
  features: text("features"), // JSON array: ["piscina", "churrasqueira", "academia"]
  
  // Imagens (JSON array de URLs)
  images: text("images"), // JSON array de objetos: [{url: "", caption: ""}]
  mainImage: varchar("mainImage", { length: 500 }),
  
  // Status e visibilidade
  status: mysqlEnum("status", ["disponivel", "reservado", "vendido", "alugado", "inativo"]).default("disponivel").notNull(),
  featured: boolean("featured").default(false),
  published: boolean("published").default(true),
  
  // SEO
  metaTitle: varchar("metaTitle", { length: 255 }),
  metaDescription: text("metaDescription"),
  slug: varchar("slug", { length: 255 }).unique(),
  
  // Timestamps
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  createdBy: int("createdBy"),
});

export type Property = typeof properties.$inferSelect;
export type InsertProperty = typeof properties.$inferInsert;

// ============================================
// TABELA DE IMAGENS DE IMÓVEIS
// ============================================

export const propertyImages = mysqlTable("propertyImages", {
  id: int("id").autoincrement().primaryKey(),
  propertyId: int("propertyId").notNull(),
  imageUrl: varchar("imageUrl", { length: 500 }).notNull(),
  imageKey: varchar("imageKey", { length: 500 }).notNull(),
  isPrimary: int("isPrimary").default(0).notNull(), // 1 = imagem principal, 0 = secundária
  displayOrder: int("displayOrder").default(0).notNull(),
  caption: varchar("caption", { length: 255 }),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type PropertyImage = typeof propertyImages.$inferSelect;
export type InsertPropertyImage = typeof propertyImages.$inferInsert;

// ============================================
// TABELA DE LEADS/CLIENTES
// ============================================

export const leads = mysqlTable("leads", {
  id: int("id").autoincrement().primaryKey(),
  
  // Informações pessoais
  name: varchar("name", { length: 255 }).notNull(),
  email: varchar("email", { length: 320 }),
  phone: varchar("phone", { length: 20 }),
  whatsapp: varchar("whatsapp", { length: 20 }),
  
  // Origem do lead
  source: mysqlEnum("source", [
    "site",
    "whatsapp",
    "instagram",
    "facebook",
    "indicacao",
    "portal_zap",
    "portal_vivareal",
    "portal_olx",
    "google",
    "outro"
  ]).default("site"),
  
  // Status no pipeline
  stage: mysqlEnum("stage", [
    "novo",
    "contato_inicial",
    "qualificado",
    "visita_agendada",
    "visita_realizada",
    "proposta",
    "negociacao",
    "fechado_ganho",
    "fechado_perdido",
    "sem_interesse"
  ]).default("novo").notNull(),
  
  // Perfil do cliente
  clientType: mysqlEnum("clientType", [
    "comprador",
    "locatario",
    "proprietario"
  ]).default("comprador").notNull(),
  
  qualification: mysqlEnum("qualification", [
    "quente",
    "morno",
    "frio",
    "nao_qualificado"
  ]).default("nao_qualificado").notNull(),
  
  buyerProfile: mysqlEnum("buyerProfile", [
    "investidor",
    "primeira_casa",
    "upgrade",
    "curioso",
    "indeciso"
  ]),
  
  urgencyLevel: mysqlEnum("urgencyLevel", [
    "baixa",
    "media",
    "alta",
    "urgente"
  ]).default("media"),
  
  // Interesse
  interestedPropertyId: int("interestedPropertyId"), // ID do imóvel de interesse
  transactionInterest: mysqlEnum("transactionInterest", ["venda", "locacao", "ambos"]).default("venda"),
  budgetMin: int("budgetMin"), // em centavos
  budgetMax: int("budgetMax"), // em centavos
  preferredNeighborhoods: text("preferredNeighborhoods"), // JSON array
  preferredPropertyTypes: text("preferredPropertyTypes"), // JSON array
  
  // Notas e tags
  notes: text("notes"),
  tags: text("tags"), // JSON array: ["vip", "urgente", "investidor"]
  
  // Atribuição
  assignedTo: int("assignedTo"), // ID do usuário responsável
  
  // Score e prioridade
  score: int("score").default(0), // 0-100
  priority: mysqlEnum("priority", ["baixa", "media", "alta", "urgente"]).default("media"),
  
  // Timestamps
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  lastContactedAt: timestamp("lastContactedAt"),
  convertedAt: timestamp("convertedAt"),
});

export type Lead = typeof leads.$inferSelect;
export type InsertLead = typeof leads.$inferInsert;

// ============================================
// TABELA DE INTERAÇÕES/HISTÓRICO
// ============================================

export const interactions = mysqlTable("interactions", {
  id: int("id").autoincrement().primaryKey(),
  
  leadId: int("leadId").notNull(),
  userId: int("userId"), // Quem fez a interação
  
  type: mysqlEnum("type", [
    "ligacao",
    "whatsapp",
    "email",
    "visita",
    "reuniao",
    "proposta",
    "nota",
    "status_change"
  ]).notNull(),
  
  subject: varchar("subject", { length: 255 }),
  description: text("description"),
  
  // Metadados específicos (JSON)
  metadata: text("metadata"), // Ex: {duration: 300, outcome: "positivo"}
  
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type Interaction = typeof interactions.$inferSelect;
export type InsertInteraction = typeof interactions.$inferInsert;

// ============================================
// TABELA DE BLOG POSTS
// ============================================

export const blogPosts = mysqlTable("blog_posts", {
  id: int("id").autoincrement().primaryKey(),
  
  title: varchar("title", { length: 255 }).notNull(),
  slug: varchar("slug", { length: 255 }).unique().notNull(),
  excerpt: text("excerpt"),
  content: text("content").notNull(),
  
  featuredImage: varchar("featuredImage", { length: 500 }),
  
  categoryId: int("categoryId"),
  authorId: int("authorId"),
  
  // SEO
  metaTitle: varchar("metaTitle", { length: 255 }),
  metaDescription: text("metaDescription"),
  
  // Status
  published: boolean("published").default(false),
  publishedAt: timestamp("publishedAt"),
  
  // Estatísticas
  views: int("views").default(0),
  
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type BlogPost = typeof blogPosts.$inferSelect;
export type InsertBlogPost = typeof blogPosts.$inferInsert;

// ============================================
// TABELA DE CATEGORIAS DE BLOG
// ============================================

export const blogCategories = mysqlTable("blog_categories", {
  id: int("id").autoincrement().primaryKey(),
  
  name: varchar("name", { length: 100 }).notNull(),
  slug: varchar("slug", { length: 100 }).unique().notNull(),
  description: text("description"),
  
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type BlogCategory = typeof blogCategories.$inferSelect;
export type InsertBlogCategory = typeof blogCategories.$inferInsert;

// ============================================
// TABELA DE CONFIGURAÇÕES DO SITE
// ============================================

export const siteSettings = mysqlTable("site_settings", {
  id: int("id").autoincrement().primaryKey(),
  
  // Informações da empresa
  companyName: varchar("companyName", { length: 255 }),
  companyDescription: text("companyDescription"),
  companyLogo: varchar("companyLogo", { length: 500 }),
  
  // Informações do corretor
  realtorName: varchar("realtorName", { length: 255 }),
  realtorPhoto: varchar("realtorPhoto", { length: 500 }),
  realtorBio: text("realtorBio"),
  realtorCreci: varchar("realtorCreci", { length: 50 }),
  
  // Contatos
  phone: varchar("phone", { length: 20 }),
  whatsapp: varchar("whatsapp", { length: 20 }),
  email: varchar("email", { length: 320 }),
  address: text("address"),
  
  // Redes sociais
  instagram: varchar("instagram", { length: 255 }),
  facebook: varchar("facebook", { length: 255 }),
  youtube: varchar("youtube", { length: 255 }),
  tiktok: varchar("tiktok", { length: 255 }),
  linkedin: varchar("linkedin", { length: 255 }),
  
  // SEO
  siteTitle: varchar("siteTitle", { length: 255 }),
  siteDescription: text("siteDescription"),
  siteKeywords: text("siteKeywords"),
  
  // Integrações
  googleAnalyticsId: varchar("googleAnalyticsId", { length: 50 }),
  facebookPixelId: varchar("facebookPixelId", { length: 50 }),
  
  // Customização Visual (Site Builder)
  themeStyle: mysqlEnum("themeStyle", ["modern", "classic"]).default("modern"),
  primaryColor: varchar("primaryColor", { length: 7 }).default("#0f172a"), // Hex color
  
  // Seção Hero
  heroTitle: varchar("heroTitle", { length: 255 }),
  heroSubtitle: text("heroSubtitle"),
  heroBackgroundImage: varchar("heroBackgroundImage", { length: 500 }),
  
  // Seção Sobre
  aboutSectionTitle: varchar("aboutSectionTitle", { length: 255 }),
  aboutSectionContent: text("aboutSectionContent"),
  aboutSectionImage: varchar("aboutSectionImage", { length: 500 }),
  
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type SiteSetting = typeof siteSettings.$inferSelect;
export type InsertSiteSetting = typeof siteSettings.$inferInsert;

// ============================================
// TABELAS DE INTEGRAÇÃO WHATSAPP / N8N
// ============================================

// Buffer de mensagens do WhatsApp
export const messageBuffer = mysqlTable("message_buffer", {
  id: int("id").autoincrement().primaryKey(),
  phone: varchar("phone", { length: 20 }).notNull(),
  messageId: varchar("messageId", { length: 255 }).notNull().unique(),
  content: text("content"),
  type: mysqlEnum("type", ["incoming", "outgoing"]).notNull(),
  timestamp: timestamp("timestamp").defaultNow().notNull(),
  processed: int("processed").default(0).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type MessageBuffer = typeof messageBuffer.$inferSelect;
export type InsertMessageBuffer = typeof messageBuffer.$inferInsert;

// Contexto e histórico de IA
export const aiContextStatus = mysqlTable("ai_context_status", {
  id: int("id").autoincrement().primaryKey(),
  sessionId: varchar("sessionId", { length: 255 }).notNull(),
  phone: varchar("phone", { length: 20 }).notNull(),
  message: text("message").notNull(), // JSON com {type: 'ai'|'user', content: string}
  role: mysqlEnum("role", ["user", "assistant", "system"]).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type AiContextStatus = typeof aiContextStatus.$inferSelect;
export type InsertAiContextStatus = typeof aiContextStatus.$inferInsert;

// Interesses dos clientes (para N8N)
export const clientInterests = mysqlTable("client_interests", {
  id: int("id").autoincrement().primaryKey(),
  clientId: int("clientId").notNull(), // Referência ao lead
  propertyType: varchar("propertyType", { length: 100 }), // Tipo de imóvel de interesse
  interestType: mysqlEnum("interestType", ["venda", "locacao", "ambos"]),
  budgetMin: int("budgetMin"), // Em centavos
  budgetMax: int("budgetMax"), // Em centavos
  preferredNeighborhoods: text("preferredNeighborhoods"),
  notes: text("notes"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type ClientInterest = typeof clientInterests.$inferSelect;
export type InsertClientInterest = typeof clientInterests.$inferInsert;

// Webhooks e logs de integração
export const webhookLogs = mysqlTable("webhook_logs", {
  id: int("id").autoincrement().primaryKey(),
  source: varchar("source", { length: 50 }).notNull(), // whatsapp, n8n, etc
  event: varchar("event", { length: 100 }).notNull(),
  payload: text("payload"), // JSON do payload recebido
  response: text("response"), // JSON da resposta enviada
  status: mysqlEnum("status", ["success", "error", "pending"]).notNull(),
  errorMessage: text("errorMessage"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type WebhookLog = typeof webhookLogs.$inferSelect;
export type InsertWebhookLog = typeof webhookLogs.$inferInsert;

// ============================================
// TABELA DE PROPRIETÁRIOS
// ============================================

export const owners = mysqlTable("owners", {
  id: int("id").autoincrement().primaryKey(),
  
  // Informações pessoais
  name: varchar("name", { length: 255 }).notNull(),
  cpfCnpj: varchar("cpfCnpj", { length: 20 }),
  email: varchar("email", { length: 320 }),
  phone: varchar("phone", { length: 20 }),
  whatsapp: varchar("whatsapp", { length: 20 }),
  
  // Endereço
  address: text("address"),
  city: varchar("city", { length: 100 }),
  state: varchar("state", { length: 2 }),
  zipCode: varchar("zipCode", { length: 10 }),
  
  // Informações bancárias (para pagamentos)
  bankName: varchar("bankName", { length: 100 }),
  bankAgency: varchar("bankAgency", { length: 20 }),
  bankAccount: varchar("bankAccount", { length: 30 }),
  pixKey: varchar("pixKey", { length: 255 }),
  
  // Notas e observações
  notes: text("notes"),
  
  // Status
  active: boolean("active").default(true),
  
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Owner = typeof owners.$inferSelect;
export type InsertOwner = typeof owners.$inferInsert;

// ============================================
// TABELAS DE ANALYTICS E MÉTRICAS
// ============================================

export const analyticsEvents = mysqlTable("analytics_events", {
  id: int("id").autoincrement().primaryKey(),
  
  // Tipo de evento
  eventType: varchar("eventType", { length: 50 }).notNull(), // page_view, property_view, contact_form, whatsapp_click, phone_click
  
  // Dados do evento
  propertyId: int("propertyId"),
  leadId: int("leadId"),
  userId: int("userId"),
  
  // Origem do tráfego
  source: varchar("source", { length: 100 }), // google_ads, facebook_ads, instagram, organic, direct
  medium: varchar("medium", { length: 100 }), // cpc, social, organic, referral
  campaign: varchar("campaign", { length: 255 }), // Nome da campanha
  
  // Dados técnicos
  url: varchar("url", { length: 500 }),
  referrer: varchar("referrer", { length: 500 }),
  userAgent: text("userAgent"),
  ipAddress: varchar("ipAddress", { length: 45 }),
  
  // Metadados
  metadata: json("metadata"), // Dados adicionais em JSON
  
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type AnalyticsEvent = typeof analyticsEvents.$inferSelect;
export type InsertAnalyticsEvent = typeof analyticsEvents.$inferInsert;

export const campaignSources = mysqlTable("campaign_sources", {
  id: int("id").autoincrement().primaryKey(),
  
  // Identificação da campanha
  name: varchar("name", { length: 255 }).notNull(),
  source: varchar("source", { length: 100 }).notNull(), // google, facebook, instagram, etc
  medium: varchar("medium", { length: 100 }), // cpc, social, etc
  campaignId: varchar("campaignId", { length: 255 }), // ID externo da campanha
  
  // Métricas
  budget: decimal("budget", { precision: 10, scale: 2 }), // Orçamento investido
  clicks: int("clicks").default(0),
  impressions: int("impressions").default(0),
  conversions: int("conversions").default(0), // Leads gerados
  
  // Status
  active: boolean("active").default(true),
  startDate: date("startDate"),
  endDate: date("endDate"),
  
  // Notas
  notes: text("notes"),
  
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type CampaignSource = typeof campaignSources.$inferSelect;
export type InsertCampaignSource = typeof campaignSources.$inferInsert;

// ============================================
// TABELAS FINANCEIRAS
// ============================================

export const transactions = mysqlTable("transactions", {
  id: int("id").autoincrement().primaryKey(),
  
  // Tipo de transação
  type: varchar("type", { length: 50 }).notNull(), // commission, expense, revenue
  category: varchar("category", { length: 100 }), // sale_commission, marketing, office, etc
  
  // Valores
  amount: decimal("amount", { precision: 12, scale: 2 }).notNull(),
  currency: varchar("currency", { length: 3 }).default("BRL"),
  
  // Relacionamentos
  propertyId: int("propertyId"), // Imóvel relacionado
  leadId: int("leadId"), // Cliente relacionado
  ownerId: int("ownerId"), // Proprietário relacionado
  
  // Descrição
  description: text("description").notNull(),
  notes: text("notes"),
  
  // Status de pagamento
  status: varchar("status", { length: 50 }).default("pending"), // pending, paid, cancelled
  paymentMethod: varchar("paymentMethod", { length: 50 }), // pix, transfer, check, cash
  paymentDate: date("paymentDate"),
  dueDate: date("dueDate"),
  
  // Comprovantes
  receiptUrl: varchar("receiptUrl", { length: 500 }),
  invoiceNumber: varchar("invoiceNumber", { length: 100 }),
  
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Transaction = typeof transactions.$inferSelect;
export type InsertTransaction = typeof transactions.$inferInsert;

export const commissions = mysqlTable("commissions", {
  id: int("id").autoincrement().primaryKey(),
  
  // Venda relacionada
  propertyId: int("propertyId").notNull(),
  leadId: int("leadId").notNull(), // Comprador
  ownerId: int("ownerId"), // Vendedor
  
  // Valores da venda
  salePrice: decimal("salePrice", { precision: 12, scale: 2 }).notNull(),
  commissionRate: decimal("commissionRate", { precision: 5, scale: 2 }).notNull(), // Percentual (ex: 6.00 para 6%)
  commissionAmount: decimal("commissionAmount", { precision: 12, scale: 2 }).notNull(),
  
  // Divisão de comissão (se houver)
  splitWithAgent: boolean("splitWithAgent").default(false),
  agentName: varchar("agentName", { length: 255 }),
  agentCommissionAmount: decimal("agentCommissionAmount", { precision: 12, scale: 2 }),
  
  // Status
  status: varchar("status", { length: 50 }).default("pending"), // pending, paid, cancelled
  paymentDate: date("paymentDate"),
  
  // Notas
  notes: text("notes"),
  
  // Transação financeira relacionada
  transactionId: int("transactionId"),
  
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Commission = typeof commissions.$inferSelect;
export type InsertCommission = typeof commissions.$inferInsert;

// ============================================
// TABELA DE AVALIAÇÕES DE CLIENTES
// ============================================

export const reviews = mysqlTable("reviews", {
  id: int("id").autoincrement().primaryKey(),
  
  // Informações do cliente
  clientName: varchar("clientName", { length: 255 }).notNull(),
  clientRole: varchar("clientRole", { length: 100 }), // Empresário, Médico, etc
  clientPhoto: varchar("clientPhoto", { length: 500 }),
  
  // Avaliação
  rating: int("rating").notNull(), // 1 a 5 estrelas
  title: varchar("title", { length: 255 }),
  content: text("content").notNull(),
  
  // Relacionamentos (opcional)
  propertyId: int("propertyId"), // Imóvel avaliado
  leadId: int("leadId"), // Cliente do CRM
  
  // Status
  approved: boolean("approved").default(false),
  featured: boolean("featured").default(false), // Destacar na home
  
  // Metadados
  displayOrder: int("displayOrder").default(0),
  
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Review = typeof reviews.$inferSelect;
export type InsertReview = typeof reviews.$inferInsert;

// ============================================
// TABELAS DE CONTRATOS E INTELIGÊNCIA
// ============================================

export const contracts = mysqlTable("contracts", {
  id: int("id").autoincrement().primaryKey(),
  propertyId: int("propertyId").notNull(),
  tenantId: int("tenantId").notNull(),
  ownerId: int("ownerId").notNull(),
  status: varchar("status", { length: 50 }).default("ACTIVE").notNull(),
  rentAmount: int("rentAmount").notNull(), // em centavos
  adminFeeRate: int("adminFeeRate").default(10).notNull(), // percentual
  startDate: timestamp("startDate").defaultNow().notNull(),
  paymentDay: int("paymentDay").default(5).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Contract = typeof contracts.$inferSelect;
export type InsertContract = typeof contracts.$inferInsert;

export const leadInsights = mysqlTable("lead_insights", {
  id: int("id").autoincrement().primaryKey(),
  leadId: int("leadId").notNull(),
  sentimentScore: int("sentimentScore"), // 0-100
  aiSummary: text("aiSummary"),
  lastInteraction: timestamp("lastInteraction").defaultNow().notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type LeadInsight = typeof leadInsights.$inferSelect;
export type InsertLeadInsight = typeof leadInsights.$inferInsert;


