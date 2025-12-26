import { pgTable, serial, varchar, text, integer, decimal, timestamp, boolean, jsonb, index, foreignKey, pgEnum, uniqueIndex } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";

/**
 * SCHEMA UNIFICADO PARA CASADF V1.0.0
 * PostgreSQL/Supabase - Pronto para produção
 * 
 * Tabelas:
 * - users: Usuários do sistema (admin, proprietário, inquilino, cliente)
 * - properties: Imóveis (venda e aluguel)
 * - leads: Leads/Prospects (capturados do simulador e WhatsApp)
 * - lead_insights: Memória de IA para cada lead (n8n)
 * - contracts: Contratos de aluguel
 * - financial_transactions: Transações financeiras (receitas, despesas, repasses)
 * - blog_posts: Posts de blog para SEO
 * - webhook_logs: Logs de webhooks (n8n, WhatsApp)
 */

// ============================================
// ENUMS
// ============================================

export const roleEnum = pgEnum("role", ["admin", "owner", "tenant", "client"]);
export const propertyTypeEnum = pgEnum("property_type", ["casa", "apartamento", "cobertura", "terreno", "comercial", "rural"]);
export const transactionTypeEnum = pgEnum("transaction_type", ["venda", "locacao", "ambos"]);
export const leadStatusEnum = pgEnum("lead_status", ["novo", "contato_inicial", "qualificado", "visita_agendada", "visita_realizada", "proposta", "negociacao", "fechado_ganho", "fechado_perdido", "sem_interesse"]);
export const transactionTypeFinanceEnum = pgEnum("transaction_type_finance", ["revenue", "expense", "transfer", "commission"]);
export const transactionStatusEnum = pgEnum("transaction_status", ["pending", "paid", "overdue", "cancelled"]);
export const contractStatusEnum = pgEnum("contract_status", ["ACTIVE", "INACTIVE", "TERMINATED", "EXPIRED"]);

// ============================================
// TABELA: USERS
// ============================================

export const users = pgTable(
  "users",
  {
    id: serial("id").primaryKey(),
    name: varchar("name", { length: 255 }).notNull(),
    email: varchar("email", { length: 320 }).notNull().unique(),
    passwordHash: varchar("password_hash", { length: 255 }),
    role: roleEnum("role").default("client").notNull(),
    phone: varchar("phone", { length: 20 }),
    whatsapp: varchar("whatsapp", { length: 20 }),
    avatar: varchar("avatar", { length: 500 }),
    loginMethod: varchar("login_method", { length: 50 }).default("local"),
    openId: varchar("open_id", { length: 255 }).unique(),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
    lastSignedIn: timestamp("last_signed_in", { withTimezone: true }),
  },
  (table) => ({
    emailIdx: index("users_email_idx").on(table.email),
    roleIdx: index("users_role_idx").on(table.role),
  })
);

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;

// ============================================
// TABELA: PROPERTIES (Imóveis)
// ============================================

export const properties = pgTable(
  "properties",
  {
    id: serial("id").primaryKey(),
    title: varchar("title", { length: 255 }).notNull(),
    description: text("description"),
    propertyType: propertyTypeEnum("property_type").notNull(),
    transactionType: transactionTypeEnum("transaction_type").notNull(),
    
    // Preços
    salePrice: decimal("sale_price", { precision: 15, scale: 2 }),
    rentPrice: decimal("rent_price", { precision: 10, scale: 2 }),
    
    // Localização
    address: varchar("address", { length: 500 }).notNull(),
    neighborhood: varchar("neighborhood", { length: 255 }),
    city: varchar("city", { length: 255 }).notNull(),
    state: varchar("state", { length: 2 }).notNull(),
    zipCode: varchar("zip_code", { length: 10 }),
    latitude: decimal("latitude", { precision: 10, scale: 8 }),
    longitude: decimal("longitude", { precision: 11, scale: 8 }),
    
    // Características
    bedrooms: integer("bedrooms"),
    bathrooms: integer("bathrooms"),
    parkingSpaces: integer("parking_spaces"),
    totalArea: decimal("total_area", { precision: 10, scale: 2 }),
    builtArea: decimal("built_area", { precision: 10, scale: 2 }),
    
    // Mídia
    mainImage: varchar("main_image", { length: 500 }),
    images: jsonb("images"), // Array de URLs
    
    // Status
    status: varchar("status", { length: 50 }).default("disponivel"),
    featured: boolean("featured").default(false),
    published: boolean("published").default(true),
    
    // Relacionamentos
    ownerId: integer("owner_id").references(() => users.id, { onDelete: "set null" }),
    createdBy: integer("created_by").references(() => users.id, { onDelete: "set null" }),
    
    // Timestamps
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => ({
    ownerIdx: index("properties_owner_id_idx").on(table.ownerId),
    cityIdx: index("properties_city_idx").on(table.city),
    statusIdx: index("properties_status_idx").on(table.status),
    typeIdx: index("properties_type_idx").on(table.propertyType),
  })
);

export type Property = typeof properties.$inferSelect;
export type InsertProperty = typeof properties.$inferInsert;

// ============================================
// TABELA: LEADS (Prospects)
// ============================================

export const leads = pgTable(
  "leads",
  {
    id: serial("id").primaryKey(),
    name: varchar("name", { length: 255 }).notNull(),
    email: varchar("email", { length: 320 }).unique(),
    phone: varchar("phone", { length: 20 }),
    whatsapp: varchar("whatsapp", { length: 20 }),
    
    // Status e qualificação
    status: leadStatusEnum("status").default("novo").notNull(),
    source: varchar("source", { length: 50 }), // website, whatsapp, simulador, google, etc
    score: integer("score").default(0),
    priority: varchar("priority", { length: 20 }).default("media"),
    
    // Preferências
    interestedPropertyType: varchar("interested_property_type", { length: 50 }),
    transactionType: varchar("transaction_type", { length: 50 }), // venda ou locacao
    budgetMin: decimal("budget_min", { precision: 15, scale: 2 }),
    budgetMax: decimal("budget_max", { precision: 15, scale: 2 }),
    preferredNeighborhoods: text("preferred_neighborhoods"),
    preferredPropertyTypes: text("preferred_property_types"),
    
    // Relacionamentos
    interestedPropertyId: integer("interested_property_id").references(() => properties.id, { onDelete: "set null" }),
    assignedTo: integer("assigned_to").references(() => users.id, { onDelete: "set null" }),
    
    // Notas e tags
    notes: text("notes"),
    tags: jsonb("tags"), // Array de tags
    
    // Timestamps
    lastContactedAt: timestamp("last_contacted_at", { withTimezone: true }),
    convertedAt: timestamp("converted_at", { withTimezone: true }),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => ({
    emailIdx: index("leads_email_idx").on(table.email),
    statusIdx: index("leads_status_idx").on(table.status),
    sourceIdx: index("leads_source_idx").on(table.source),
    assignedIdx: index("leads_assigned_to_idx").on(table.assignedTo),
  })
);

export type Lead = typeof leads.$inferSelect;
export type InsertLead = typeof leads.$inferInsert;

// ============================================
// TABELA: LEAD_INSIGHTS (Memória de IA)
// ============================================

export const leadInsights = pgTable(
  "lead_insights",
  {
    id: serial("id").primaryKey(),
    leadId: integer("lead_id").notNull().references(() => leads.id, { onDelete: "cascade" }),
    sessionId: varchar("session_id", { length: 255 }),
    
    // Conteúdo da conversa
    content: text("content"),
    sender: varchar("sender", { length: 50 }), // user, assistant, system
    
    // Análise de IA
    sentimentScore: integer("sentiment_score"), // 0-100
    aiSummary: text("ai_summary"),
    recommendedAction: text("recommended_action"),
    
    // Metadata
    metadata: jsonb("metadata"),
    
    // Timestamps
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => ({
    leadIdx: index("lead_insights_lead_id_idx").on(table.leadId),
    sessionIdx: index("lead_insights_session_id_idx").on(table.sessionId),
  })
);

export type LeadInsight = typeof leadInsights.$inferSelect;
export type InsertLeadInsight = typeof leadInsights.$inferInsert;

// ============================================
// TABELA: CONTRACTS (Contratos de Aluguel)
// ============================================

export const contracts = pgTable(
  "contracts",
  {
    id: serial("id").primaryKey(),
    
    // Relacionamentos
    propertyId: integer("property_id").notNull().references(() => properties.id, { onDelete: "cascade" }),
    tenantId: integer("tenant_id").notNull().references(() => users.id, { onDelete: "restrict" }),
    ownerId: integer("owner_id").notNull().references(() => users.id, { onDelete: "restrict" }),
    
    // Valores
    rentAmount: decimal("rent_amount", { precision: 10, scale: 2 }).notNull(),
    adminFeeRate: decimal("admin_fee_rate", { precision: 5, scale: 2 }).default("10.00"), // Percentual
    adminFeeAmount: decimal("admin_fee_amount", { precision: 10, scale: 2 }),
    securityDeposit: decimal("security_deposit", { precision: 10, scale: 2 }),
    
    // Datas
    startDate: timestamp("start_date", { withTimezone: true }).notNull(),
    endDate: timestamp("end_date", { withTimezone: true }),
    paymentDay: integer("payment_day").default(5), // Dia do mês
    
    // Status
    status: contractStatusEnum("status").default("ACTIVE").notNull(),
    
    // Documentos
    documentUrl: varchar("document_url", { length: 500 }),
    
    // Timestamps
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => ({
    propertyIdx: index("contracts_property_id_idx").on(table.propertyId),
    tenantIdx: index("contracts_tenant_id_idx").on(table.tenantId),
    ownerIdx: index("contracts_owner_id_idx").on(table.ownerId),
    statusIdx: index("contracts_status_idx").on(table.status),
  })
);

export type Contract = typeof contracts.$inferSelect;
export type InsertContract = typeof contracts.$inferInsert;

// ============================================
// TABELA: FINANCIAL_TRANSACTIONS
// ============================================

export const financialTransactions = pgTable(
  "financial_transactions",
  {
    id: serial("id").primaryKey(),
    
    // Relacionamento
    contractId: integer("contract_id").references(() => contracts.id, { onDelete: "set null" }),
    propertyId: integer("property_id").references(() => properties.id, { onDelete: "set null" }),
    
    // Tipo e categoria
    type: transactionTypeFinanceEnum("type").notNull(), // revenue, expense, transfer, commission
    category: varchar("category", { length: 100 }).notNull(), // rent_income, admin_fee, owner_transfer, maintenance, etc
    
    // Valores
    amount: decimal("amount", { precision: 15, scale: 2 }).notNull(),
    currency: varchar("currency", { length: 3 }).default("BRL"),
    
    // Descrição
    description: text("description"),
    
    // Status
    status: transactionStatusEnum("status").default("pending").notNull(),
    
    // Datas
    dueDate: timestamp("due_date", { withTimezone: true }).notNull(),
    paymentDate: timestamp("payment_date", { withTimezone: true }),
    
    // Referência
    referenceNumber: varchar("reference_number", { length: 100 }),
    
    // Timestamps
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => ({
    contractIdx: index("financial_transactions_contract_id_idx").on(table.contractId),
    propertyIdx: index("financial_transactions_property_id_idx").on(table.propertyId),
    typeIdx: index("financial_transactions_type_idx").on(table.type),
    statusIdx: index("financial_transactions_status_idx").on(table.status),
    dueDateIdx: index("financial_transactions_due_date_idx").on(table.dueDate),
  })
);

export type FinancialTransaction = typeof financialTransactions.$inferSelect;
export type InsertFinancialTransaction = typeof financialTransactions.$inferInsert;

// ============================================
// TABELA: BLOG_POSTS
// ============================================

export const blogPosts = pgTable(
  "blog_posts",
  {
    id: serial("id").primaryKey(),
    title: varchar("title", { length: 255 }).notNull(),
    slug: varchar("slug", { length: 255 }).notNull().unique(),
    content: text("content").notNull(),
    excerpt: text("excerpt"),
    author: varchar("author", { length: 255 }),
    
    // SEO
    metaDescription: varchar("meta_description", { length: 160 }),
    metaKeywords: varchar("meta_keywords", { length: 255 }),
    
    // Status
    status: varchar("status", { length: 50 }).default("draft"),
    featured: boolean("featured").default(false),
    published: boolean("published").default(false),
    
    // Timestamps
    publishedAt: timestamp("published_at", { withTimezone: true }),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => ({
    slugIdx: uniqueIndex("blog_posts_slug_idx").on(table.slug),
    statusIdx: index("blog_posts_status_idx").on(table.status),
  })
);

export type BlogPost = typeof blogPosts.$inferSelect;
export type InsertBlogPost = typeof blogPosts.$inferInsert;

// ============================================
// TABELA: WEBHOOK_LOGS
// ============================================

export const webhookLogs = pgTable(
  "webhook_logs",
  {
    id: serial("id").primaryKey(),
    source: varchar("source", { length: 100 }).notNull(), // n8n, whatsapp, stripe, etc
    event: varchar("event", { length: 100 }).notNull(), // lead_created, payment_received, etc
    payload: jsonb("payload"),
    response: jsonb("response"),
    status: varchar("status", { length: 50 }).notNull(), // success, error, pending
    errorMessage: text("error_message"),
    
    // Timestamps
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => ({
    sourceIdx: index("webhook_logs_source_idx").on(table.source),
    eventIdx: index("webhook_logs_event_idx").on(table.event),
    statusIdx: index("webhook_logs_status_idx").on(table.status),
  })
);

export type WebhookLog = typeof webhookLogs.$inferSelect;
export type InsertWebhookLog = typeof webhookLogs.$inferInsert;

// ============================================
// RELATIONS (Drizzle ORM)
// ============================================

export const usersRelations = relations(users, ({ many }) => ({
  ownedProperties: many(properties, { relationName: "owner" }),
  createdProperties: many(properties, { relationName: "creator" }),
  leads: many(leads, { relationName: "assignee" }),
  tenantContracts: many(contracts, { relationName: "tenant" }),
  ownerContracts: many(contracts, { relationName: "owner" }),
}));

export const propertiesRelations = relations(properties, ({ one, many }) => ({
  owner: one(users, { fields: [properties.ownerId], references: [users.id], relationName: "owner" }),
  creator: one(users, { fields: [properties.createdBy], references: [users.id], relationName: "creator" }),
  leads: many(leads, { relationName: "property" }),
  contracts: many(contracts, { relationName: "property" }),
  transactions: many(financialTransactions, { relationName: "property" }),
}));

export const leadsRelations = relations(leads, ({ one, many }) => ({
  property: one(properties, { fields: [leads.interestedPropertyId], references: [properties.id], relationName: "property" }),
  assignee: one(users, { fields: [leads.assignedTo], references: [users.id], relationName: "assignee" }),
  insights: many(leadInsights, { relationName: "lead" }),
}));

export const leadInsightsRelations = relations(leadInsights, ({ one }) => ({
  lead: one(leads, { fields: [leadInsights.leadId], references: [leads.id], relationName: "lead" }),
}));

export const contractsRelations = relations(contracts, ({ one, many }) => ({
  property: one(properties, { fields: [contracts.propertyId], references: [properties.id], relationName: "property" }),
  tenant: one(users, { fields: [contracts.tenantId], references: [users.id], relationName: "tenant" }),
  owner: one(users, { fields: [contracts.ownerId], references: [users.id], relationName: "owner" }),
  transactions: many(financialTransactions, { relationName: "contract" }),
}));

export const financialTransactionsRelations = relations(financialTransactions, ({ one }) => ({
  contract: one(contracts, { fields: [financialTransactions.contractId], references: [contracts.id], relationName: "contract" }),
  property: one(properties, { fields: [financialTransactions.propertyId], references: [properties.id], relationName: "property" }),
}));
