import { describe, it, expect, beforeAll } from "vitest";
import { appRouter } from "./routers";
import type { TrpcContext } from "./_core/context";
import * as db from "./db";

function createPublicContext(): TrpcContext {
  return {
    user: null,
    req: {
      protocol: "https",
      headers: {},
    } as TrpcContext["req"],
    res: {
      clearCookie: () => {},
    } as TrpcContext["res"],
  };
}

describe.skip("Integration Webhooks (N8N)", () => {
  let caller: ReturnType<typeof appRouter.createCaller>;
  let testPhone: string;

  beforeAll(async () => {
    const ctx = createPublicContext();
    caller = appRouter.createCaller(ctx);
    testPhone = `5561${Date.now().toString().slice(-8)}`;
  });

  it("deve receber mensagem do WhatsApp", async () => {
    const result = await caller.integration.whatsappWebhook({
      phone: testPhone,
      messageId: `msg-${Date.now()}`,
      content: "Olá, tenho interesse em imóveis",
      type: "incoming",
      timestamp: new Date().toISOString(),
    });

    expect(result.success).toBe(true);
    expect(result.messageId).toBeDefined();
  });

  it("deve salvar lead do WhatsApp", async () => {
    const result = await caller.integration.saveLeadFromWhatsApp({
      name: "João Teste",
      phone: testPhone,
      email: "joao@test.com",
      message: "Interessado em casas no Lago Sul",
      propertyInterest: "casa",
      budgetRange: "R$ 2M - R$ 5M",
    });

    expect(result.success).toBe(true);
    expect(result.lead).toBeDefined();
    expect(result.lead.phone).toBe(testPhone);
    expect(result.lead.name).toBe("João Teste");
  });

  it("deve buscar imóveis compatíveis para cliente", async () => {
    const result = await caller.integration.matchPropertiesForClient({
      phone: testPhone,
      transactionType: "venda",
      propertyType: "casa",
      limit: 3,
    });

    expect(result.success).toBe(true);
    expect(result.lead).toBeDefined();
    expect(result.properties).toBeDefined();
    expect(Array.isArray(result.properties)).toBe(true);
  });

  it("deve atualizar qualificação do lead", async () => {
    const result = await caller.integration.updateLeadQualification({
      phone: testPhone,
      qualification: "quente",
      buyerProfile: "investidor",
      urgencyLevel: "alta",
      notes: "Cliente demonstrou forte interesse",
    });

    expect(result.success).toBe(true);
    expect(result.leadId).toBeDefined();
  });

  it("deve salvar contexto de IA", async () => {
    const result = await caller.integration.saveAiContext({
      sessionId: `session-${Date.now()}`,
      phone: testPhone,
      message: JSON.stringify({ type: "user", content: "Quero ver casas" }),
      role: "user",
    });

    expect(result.success).toBe(true);
    expect(result.contextId).toBeDefined();
  });

  it("deve buscar histórico de conversa", async () => {
    const history = await caller.integration.getHistory({
      phone: testPhone,
      limit: 10,
    });

    expect(history).toBeDefined();
    expect(Array.isArray(history)).toBe(true);
  });

  it("deve listar logs de webhook", async () => {
    const logs = await caller.integration.getWebhookLogs({ limit: 10 });

    expect(logs).toBeDefined();
    expect(Array.isArray(logs)).toBe(true);
    expect(logs.length).toBeGreaterThan(0);
  });

  it("deve retornar erro ao buscar imóveis para telefone inexistente", async () => {
    const result = await caller.integration.matchPropertiesForClient({
      phone: "5561000000000",
      limit: 3,
    });

    expect(result.success).toBe(false);
    expect(result.error).toBe("Lead não encontrado");
    expect(result.properties).toEqual([]);
  });
});
