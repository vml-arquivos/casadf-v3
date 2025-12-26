import { int, mysqlEnum, mysqlTable, text, timestamp, varchar, boolean } from "drizzle-orm/mysql-core";
/**
 * Schema completo para o sistema Corretor das Mansões
 * Inclui: usuários, imóveis, leads, interações, blog, configurações
 */
// ============================================
// TABELA DE USUÁRIOS (AUTH)
// ============================================
export const users = mysqlTable("users", {
    id: int("id").autoincrement().primaryKey(),
    openId: varchar("openId", { length: 64 }).notNull().unique(),
    name: text("name"),
    email: varchar("email", { length: 320 }),
    loginMethod: varchar("loginMethod", { length: 64 }),
    role: mysqlEnum("role", ["user", "admin"]).default("user").notNull(),
    createdAt: timestamp("createdAt").defaultNow().notNull(),
    updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
    lastSignedIn: timestamp("lastSignedIn").defaultNow().notNull(),
});
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
    buyerProfile: mysqlEnum("buyerProfile", [
        "investidor",
        "primeira_casa",
        "upgrade",
        "curioso",
        "indeciso"
    ]),
    // Interesse
    interestedPropertyId: int("interestedPropertyId"), // ID do imóvel de interesse
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
    updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});
