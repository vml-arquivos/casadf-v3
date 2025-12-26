import { describe, it, expect, beforeAll } from "vitest";
import { appRouter } from "./routers";
import type { TrpcContext } from "./_core/context";

type AuthenticatedUser = NonNullable<TrpcContext["user"]>;

function createAdminContext(): TrpcContext {
  const user: AuthenticatedUser = {
    id: 1,
    openId: "test-admin",
    name: "Test Admin",
    email: "admin@test.com",
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

describe.skip("Owners System", () => {
  let caller: ReturnType<typeof appRouter.createCaller>;

  beforeAll(async () => {
    const ctx = createAdminContext();
    caller = appRouter.createCaller(ctx);
  });

  it("deve criar e listar proprietários", async () => {
    const owner = await caller.owners.create({
      name: "Maria Santos Teste",
      email: `maria${Date.now()}@test.com`,
      phone: "61988888888",
    });

    expect(owner).toBeDefined();
    expect(owner.id).toBeDefined();
    expect(owner.name).toBe("Maria Santos Teste");

    const owners = await caller.owners.list();
    expect(owners).toBeDefined();
    expect(Array.isArray(owners)).toBe(true);
    expect(owners.length).toBeGreaterThan(0);
  });

  it("deve buscar proprietário por ID", async () => {
    const newOwner = await caller.owners.create({
      name: "João Teste",
      email: `joao${Date.now()}@test.com`,
    });

    const found = await caller.owners.getById({ id: newOwner.id });
    expect(found).toBeDefined();
    expect(found?.id).toBe(newOwner.id);
    expect(found?.name).toBe("João Teste");
  });

  it("deve atualizar proprietário", async () => {
    const owner = await caller.owners.create({
      name: "Pedro Teste",
      email: `pedro${Date.now()}@test.com`,
    });

    const result = await caller.owners.update({
      id: owner.id,
      data: {
        phone: "61999999999",
      },
    });

    expect(result.success).toBe(true);

    const updated = await caller.owners.getById({ id: owner.id });
    expect(updated?.phone).toBe("61999999999");
  });

  it("deve deletar proprietário", async () => {
    const owner = await caller.owners.create({
      name: "Carlos Teste",
      email: `carlos${Date.now()}@test.com`,
    });

    const result = await caller.owners.delete({ id: owner.id });
    expect(result.success).toBe(true);

    const deleted = await caller.owners.getById({ id: owner.id });
    expect(deleted).toBeNull();
  });
});
