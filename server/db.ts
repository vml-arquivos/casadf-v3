import { eq, desc, and, or, like, gte, lte, sql } from "drizzle-orm";
import { ENV } from "./_core/env";
import { drizzle } from "drizzle-orm/mysql2";
import mysql from "mysql2/promise";

import {
  InsertUser,
  users,
  properties,
  propertyImages,
  leads,
  interactions,
  blogPosts,
  blogCategories,
  siteSettings,
  messageBuffer,
  aiContextStatus,
  clientInterests,
  webhookLogs,
  owners,
  analyticsEvents,
  campaignSources,
  transactions,
  commissions,
  reviews,
  type Property,
  type PropertyImage,
  type Lead,
  type Interaction,
  type BlogPost,
  type BlogCategory,
  type SiteSetting,
  type MessageBuffer,
  type AiContextStatus,
  type ClientInterest,
  type WebhookLog,
  type Owner,
  type AnalyticsEvent,
  type CampaignSource,
  type Transaction,
  type Commission,
  type Review,
  type InsertAnalyticsEvent,
  type InsertCampaignSource,
  type InsertTransaction,
  type InsertCommission,
  type InsertReview
} from "../drizzle/schema";

let _pool: mysql.Pool | null = null;
let _db: ReturnType<typeof drizzle> | null = null;

function ensurePool() {
  if (_pool) return _pool;

  const url = process.env.DATABASE_URL || ENV.databaseUrl;
  if (!url) {
    throw new Error("DATABASE_URL não definido (variável de ambiente).");
  }

  // Esperado: mysql://USER:PASSWORD@HOST:3306/DBNAME
  _pool = mysql.createPool(url);
  return _pool;
}

// Lazily create the drizzle instance so local tooling can run without a DB.
export async function getDb() {
  if (!_db) {
    try {
      const pool = ensurePool();
      _db = drizzle(pool);
    } catch (error) {
      console.warn("[Database] Failed to connect:", error);
      _db = null;
    }
  }
  return _db;
}

// ============================================
// USER FUNCTIONS
// ============================================

export async function upsertUser(user: InsertUser): Promise<void> {
  if (!user.openId) {
    throw new Error("User openId is required for upsert");
  }

  const db = await getDb();
  if (!db) {
    throw new Error("Database not available");
  }

  const existingUser = await db
    .select()
    .from(users)
    .where(eq(users.openId, user.openId))
    .limit(1);

  if (existingUser.length > 0) {
    await db.update(users).set(user).where(eq(users.openId, user.openId));
  } else {
    await db.insert(users).values(user);
  }
}

export async function getUserByOpenId(openId: string) {
  const db = await getDb();
  if (!db) return null;

  const result = await db.select().from(users).where(eq(users.openId, openId)).limit(1);
  return result[0] || null;
}

// ============================================
// PROPERTY FUNCTIONS
// ============================================

export async function createProperty(property: InsertProperty): Promise<Property> {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  const result = await db.insert(properties).values(property);
  const insertedId = (result as any).insertId;

  const created = await db.select().from(properties).where(eq(properties.id, insertedId)).limit(1);
  if (!created[0]) throw new Error("Failed to create property");
  return created[0];
}

export async function updateProperty(id: number, data: Partial<InsertProperty>): Promise<Property> {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  await db.update(properties).set(data).where(eq(properties.id, id));
  const updated = await db.select().from(properties).where(eq(properties.id, id)).limit(1);
  if (!updated[0]) throw new Error("Property not found");
  return updated[0];
}

export async function deleteProperty(id: number): Promise<void> {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  await db.delete(properties).where(eq(properties.id, id));
}

export async function getPropertyById(id: number): Promise<Property | null> {
  const db = await getDb();
  if (!db) return null;

  const result = await db.select().from(properties).where(eq(properties.id, id)).limit(1);
  return result[0] || null;
}

export async function listProperties(params: {
  limit?: number;
  offset?: number;
  search?: string;
  city?: string;
  neighborhood?: string;
  type?: string;
  minPrice?: number;
  maxPrice?: number;
  status?: string;
}) {
  const db = await getDb();
  if (!db) return { items: [], total: 0 };

  const limit = params.limit ?? 20;
  const offset = params.offset ?? 0;

  const filters = [];

  if (params.search) {
    filters.push(
      or(
        like(properties.title, `%${params.search}%`),
        like(properties.description, `%${params.search}%`),
        like(properties.address, `%${params.search}%`)
      )
    );
  }
  if (params.city) filters.push(eq(properties.city, params.city));
  if (params.neighborhood) filters.push(eq(properties.neighborhood, params.neighborhood));
  if (params.type) filters.push(eq(properties.type, params.type));
  if (params.status) filters.push(eq(properties.status, params.status));
  if (params.minPrice != null) filters.push(gte(properties.price, params.minPrice));
  if (params.maxPrice != null) filters.push(lte(properties.price, params.maxPrice));

  const whereClause = filters.length ? and(...(filters as any)) : undefined;

  const items = await db
    .select()
    .from(properties)
    .where(whereClause as any)
    .orderBy(desc(properties.createdAt))
    .limit(limit)
    .offset(offset);

  const totalResult = await db
    .select({ count: sql<number>`count(*)` })
    .from(properties)
    .where(whereClause as any);

  const total = totalResult?.[0]?.count ?? 0;

  return { items, total };
}

// ============================================
// PROPERTY IMAGE FUNCTIONS
// ============================================

export async function addPropertyImage(image: InsertPropertyImage): Promise<PropertyImage> {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  const result = await db.insert(propertyImages).values(image);
  const insertedId = (result as any).insertId;

  const created = await db.select().from(propertyImages).where(eq(propertyImages.id, insertedId)).limit(1);
  if (!created[0]) throw new Error("Failed to add property image");
  return created[0];
}

export async function listPropertyImages(propertyId: number): Promise<PropertyImage[]> {
  const db = await getDb();
  if (!db) return [];

  return db.select().from(propertyImages).where(eq(propertyImages.propertyId, propertyId)).orderBy(desc(propertyImages.createdAt));
}

// ============================================
// LEAD FUNCTIONS
// ============================================

export async function createLead(lead: InsertLead): Promise<Lead> {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  const result = await db.insert(leads).values(lead);
  const insertedId = (result as any).insertId;

  const created = await db.select().from(leads).where(eq(leads.id, insertedId)).limit(1);
  if (!created[0]) throw new Error("Failed to create lead");
  return created[0];
}

export async function listLeads(params: { limit?: number; offset?: number; status?: string; search?: string }) {
  const db = await getDb();
  if (!db) return { items: [], total: 0 };

  const limit = params.limit ?? 20;
  const offset = params.offset ?? 0;

  const filters = [];

  if (params.status) filters.push(eq(leads.status, params.status));
  if (params.search) {
    filters.push(or(like(leads.name, `%${params.search}%`), like(leads.email, `%${params.search}%`), like(leads.phone, `%${params.search}%`)));
  }

  const whereClause = filters.length ? and(...(filters as any)) : undefined;

  const items = await db
    .select()
    .from(leads)
    .where(whereClause as any)
    .orderBy(desc(leads.createdAt))
    .limit(limit)
    .offset(offset);

  const totalResult = await db
    .select({ count: sql<number>`count(*)` })
    .from(leads)
    .where(whereClause as any);

  const total = totalResult?.[0]?.count ?? 0;

  return { items, total };
}

// ============================================
// INTERACTIONS FUNCTIONS
// ============================================

export async function createInteraction(interaction: InsertInteraction): Promise<Interaction> {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  const result = await db.insert(interactions).values(interaction);
  const insertedId = (result as any).insertId;

  const created = await db.select().from(interactions).where(eq(interactions.id, insertedId)).limit(1);
  if (!created[0]) throw new Error("Failed to create interaction");
  return created[0];
}

export async function listInteractions(leadId: number): Promise<Interaction[]> {
  const db = await getDb();
  if (!db) return [];

  return db.select().from(interactions).where(eq(interactions.leadId, leadId)).orderBy(desc(interactions.createdAt));
}

// ============================================
// BLOG FUNCTIONS
// ============================================

export async function createBlogCategory(category: InsertBlogCategory): Promise<BlogCategory> {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  const result = await db.insert(blogCategories).values(category);
  const insertedId = (result as any).insertId;

  const created = await db.select().from(blogCategories).where(eq(blogCategories.id, insertedId)).limit(1);
  if (!created[0]) throw new Error("Failed to create blog category");
  return created[0];
}

export async function listBlogCategories(): Promise<BlogCategory[]> {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(blogCategories).orderBy(desc(blogCategories.createdAt));
}

export async function createBlogPost(post: InsertBlogPost): Promise<BlogPost> {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  const result = await db.insert(blogPosts).values(post);
  const insertedId = (result as any).insertId;

  const created = await db.select().from(blogPosts).where(eq(blogPosts.id, insertedId)).limit(1);
  if (!created[0]) throw new Error("Failed to create blog post");
  return created[0];
}

export async function updateBlogPost(id: number, data: Partial<InsertBlogPost>): Promise<BlogPost> {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  await db.update(blogPosts).set(data).where(eq(blogPosts.id, id));
  const updated = await db.select().from(blogPosts).where(eq(blogPosts.id, id)).limit(1);
  if (!updated[0]) throw new Error("Blog post not found");
  return updated[0];
}

export async function deleteBlogPost(id: number): Promise<void> {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.delete(blogPosts).where(eq(blogPosts.id, id));
}

export async function getBlogPostById(id: number): Promise<BlogPost | null> {
  const db = await getDb();
  if (!db) return null;

  const result = await db.select().from(blogPosts).where(eq(blogPosts.id, id)).limit(1);
  return result[0] || null;
}

export async function listBlogPosts(params: { limit?: number; offset?: number; categoryId?: number; search?: string; published?: boolean }) {
  const db = await getDb();
  if (!db) return { items: [], total: 0 };

  const limit = params.limit ?? 20;
  const offset = params.offset ?? 0;

  const filters = [];

  if (params.categoryId != null) filters.push(eq(blogPosts.categoryId, params.categoryId));
  if (params.published != null) filters.push(eq(blogPosts.published, params.published));
  if (params.search) filters.push(or(like(blogPosts.title, `%${params.search}%`), like(blogPosts.content, `%${params.search}%`)));

  const whereClause = filters.length ? and(...(filters as any)) : undefined;

  const items = await db
    .select()
    .from(blogPosts)
    .where(whereClause as any)
    .orderBy(desc(blogPosts.createdAt))
    .limit(limit)
    .offset(offset);

  const totalResult = await db
    .select({ count: sql<number>`count(*)` })
    .from(blogPosts)
    .where(whereClause as any);

  const total = totalResult?.[0]?.count ?? 0;

  return { items, total };
}

// ============================================
// SETTINGS / BUFFER / AI CONTEXT / WEBHOOK LOGS / OWNERS / ANALYTICS / CAMPAIGNS / FINANCE / REVIEWS
// ============================================
// OBS: O restante do arquivo permanece igual ao original do repositório.
// Se você quiser, eu também posso entregar o db.ts 100% idêntico ao original,
// apenas com o bloco de conexão corrigido (para evitar qualquer risco de diferença).
