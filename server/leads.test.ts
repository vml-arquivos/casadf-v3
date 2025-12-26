import { describe, expect, it } from "vitest";
import { appRouter } from "./routers";
import type { TrpcContext } from "./_core/context";

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

describe("leads router", () => {
  it("should create lead from public form", async () => {
    const ctx = createPublicContext();
    const caller = appRouter.createCaller(ctx);

    const newLead = {
      name: "João da Silva",
      email: "joao@example.com",
      phone: "(61) 99999-9999",
      whatsapp: "(61) 99999-9999",
      source: "site" as const,
      notes: "Interessado em apartamento no Sudoeste",
    };

    const result = await caller.leads.create(newLead);

    expect(result).toBeDefined();
    expect(result.id).toBeDefined();
    expect(result.name).toBe(newLead.name);
    expect(result.stage).toBe("novo"); // Deve ser criado como "novo"
  });

  it("should list leads as admin", async () => {
    const ctx = createAdminContext();
    const caller = appRouter.createCaller(ctx);

    const result = await caller.leads.list();

    expect(result).toBeDefined();
    expect(Array.isArray(result)).toBe(true);
  });

  it("should fail to list leads as non-admin", async () => {
    const ctx = createPublicContext();
    const caller = appRouter.createCaller(ctx);

    await expect(caller.leads.list()).rejects.toThrow();
  });

  it("should filter leads by stage as admin", async () => {
    const ctx = createAdminContext();
    const caller = appRouter.createCaller(ctx);

    const result = await caller.leads.list({ stage: "novo" });

    expect(result).toBeDefined();
    expect(Array.isArray(result)).toBe(true);
    
    // Todos os resultados devem ter stage "novo"
    result.forEach(lead => {
      expect(lead.stage).toBe("novo");
    });
  });

  it("should get lead by id as admin", async () => {
    const ctx = createAdminContext();
    const caller = appRouter.createCaller(ctx);

    // Primeiro, pegar a lista para ter um ID válido
    const leads = await caller.leads.list();
    
    if (leads.length > 0) {
      const firstLead = leads[0];
      const result = await caller.leads.getById({ id: firstLead.id });

      expect(result).toBeDefined();
      expect(result?.id).toBe(firstLead.id);
    }
  });

  it("should update lead stage as admin", async () => {
    const ctx = createAdminContext();
    const caller = appRouter.createCaller(ctx);

    // Primeiro, criar um lead
    const newLead = {
      name: "Maria Santos",
      email: "maria@example.com",
      source: "whatsapp" as const,
    };

    const created = await caller.leads.create(newLead);

    // Atualizar o stage
    const updateResult = await caller.leads.update({
      id: created.id,
      data: {
        stage: "qualificado",
        notes: "Lead qualificado após contato inicial",
      },
    });

    expect(updateResult.success).toBe(true);

    // Verificar se foi atualizado
    const updated = await caller.leads.getById({ id: created.id });
    expect(updated?.stage).toBe("qualificado");
  });
});

describe("interactions router", () => {
  it("should create interaction as admin", async () => {
    const ctx = createAdminContext();
    const caller = appRouter.createCaller(ctx);

    // Primeiro, pegar um lead existente
    const leads = await caller.leads.list();
    
    if (leads.length > 0) {
      const firstLead = leads[0];

      const newInteraction = {
        leadId: firstLead.id,
        type: "ligacao" as const,
        subject: "Contato inicial",
        description: "Primeira ligação para qualificação do lead",
      };

      const result = await caller.interactions.create(newInteraction);

      expect(result).toBeDefined();
      expect(result.id).toBeDefined();
      expect(result.leadId).toBe(firstLead.id);
      expect(result.userId).toBe(1); // ID do admin
    }
  });

  it("should list interactions by lead id as admin", async () => {
    const ctx = createAdminContext();
    const caller = appRouter.createCaller(ctx);

    // Pegar um lead existente
    const leads = await caller.leads.list();
    
    if (leads.length > 0) {
      const firstLead = leads[0];

      const result = await caller.interactions.getByLeadId({ leadId: firstLead.id });

      expect(result).toBeDefined();
      expect(Array.isArray(result)).toBe(true);
    }
  });
});
