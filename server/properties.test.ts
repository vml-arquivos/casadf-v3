import { describe, expect, it, beforeAll } from "vitest";
import { appRouter } from "./routers";
import type { TrpcContext } from "./_core/context";
import * as db from "./db";

type AuthenticatedUser = NonNullable<TrpcContext["user"]>;

function createPublicContext(): TrpcContext {
  return {
    user: undefined,
    req: {
      protocol: "https",
      headers: {},
    } as TrpcContext["req"],
    res: {
      clearCookie: () => {},
    } as TrpcContext["res"],
  };
}

function createAdminContext(): TrpcContext {
  const user: AuthenticatedUser = {
    id: 1,
    openId: "admin-user",
    email: "admin@example.com",
    name: "Admin User",
    loginMethod: "manus",
    role: "admin",
    createdAt: new Date(),
    updatedAt: new Date(),
    lastSignedIn: new Date(),
  };

  return {
    user,
    req: {
      protocol: "https",
      headers: {},
    } as TrpcContext["req"],
    res: {
      clearCookie: () => {},
    } as TrpcContext["res"],
  };
}

describe("properties router", () => {
  it("should list all properties (public access)", async () => {
    const ctx = createPublicContext();
    const caller = appRouter.createCaller(ctx);

    const result = await caller.properties.list();

    expect(result).toBeDefined();
    expect(Array.isArray(result)).toBe(true);
  });

  it("should list featured properties (public access)", async () => {
    const ctx = createPublicContext();
    const caller = appRouter.createCaller(ctx);

    const result = await caller.properties.featured({ limit: 3 });

    expect(result).toBeDefined();
    expect(Array.isArray(result)).toBe(true);
    expect(result.length).toBeLessThanOrEqual(3);
  });

  it("should get property by id (public access)", async () => {
    const ctx = createPublicContext();
    const caller = appRouter.createCaller(ctx);

    // Primeiro, pegar a lista para ter um ID válido
    const properties = await caller.properties.list();
    
    if (properties.length > 0) {
      const firstProperty = properties[0];
      const result = await caller.properties.getById({ id: firstProperty.id });

      expect(result).toBeDefined();
      expect(result?.id).toBe(firstProperty.id);
    }
  });

  it("should filter properties by status", async () => {
    const ctx = createPublicContext();
    const caller = appRouter.createCaller(ctx);

    const result = await caller.properties.list({ status: "disponivel" });

    expect(result).toBeDefined();
    expect(Array.isArray(result)).toBe(true);
    
    // Todos os resultados devem ter status "disponivel"
    result.forEach(property => {
      expect(property.status).toBe("disponivel");
    });
  });

  it("should filter properties by transaction type", async () => {
    const ctx = createPublicContext();
    const caller = appRouter.createCaller(ctx);

    const result = await caller.properties.list({ transactionType: "venda" });

    expect(result).toBeDefined();
    expect(Array.isArray(result)).toBe(true);
    
    // Todos os resultados devem ter transactionType "venda"
    result.forEach(property => {
      expect(property.transactionType).toBe("venda");
    });
  });
});

describe("properties CRUD (admin only)", () => {
  it("should create property as admin", async () => {
    const ctx = createAdminContext();
    const caller = appRouter.createCaller(ctx);

    const newProperty = {
      title: "Teste - Apartamento Luxo",
      description: "Apartamento de teste",
      propertyType: "apartamento" as const,
      transactionType: "venda" as const,
      neighborhood: "Asa Sul",
      city: "Brasília",
      state: "DF",
      salePrice: 100000000, // R$ 1.000.000
      bedrooms: 3,
      bathrooms: 2,
      totalArea: 150,
      status: "disponivel" as const,
      published: true,
    };

    const result = await caller.properties.create(newProperty);

    expect(result).toBeDefined();
    expect(result.id).toBeDefined();
    expect(result.title).toBe(newProperty.title);
  });

  it("should fail to create property as non-admin", async () => {
    const ctx = createPublicContext();
    const caller = appRouter.createCaller(ctx);

    const newProperty = {
      title: "Teste - Apartamento",
      propertyType: "apartamento" as const,
      transactionType: "venda" as const,
      published: true,
    };

    await expect(caller.properties.create(newProperty)).rejects.toThrow();
  });
});
