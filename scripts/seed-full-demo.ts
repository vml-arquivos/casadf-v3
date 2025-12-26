import { drizzle } from "drizzle-orm/mysql2/driver";
import * as schema from "../drizzle/schema";
import { eq } from "drizzle-orm";
import mysql from "mysql2/promise";

// Importar hash de senha
import bcrypt from "bcryptjs";

const hashPassword = async (password: string): Promise<string> => {
  const salt = await bcrypt.genSalt(10);
  return bcrypt.hash(password, salt);
};

async function seedDatabase() {
  // Conectar ao banco de dados
  const connection = await mysql.createConnection({
    host: process.env.DB_HOST || "localhost",
    user: process.env.DB_USER || "root",
    password: process.env.DB_PASSWORD || "",
    database: process.env.DB_NAME || "imobiliaria_saas",
  });

  const db = drizzle(connection, { schema });

  try {
    console.log("🌱 Iniciando seed de dados de demonstração...\n");

    // ============================================
    // LIMPAR DADOS EXISTENTES
    // ============================================
    console.log("🗑️  Limpando dados existentes...");
    await db.delete(schema.transactions);
    await db.delete(schema.contracts);
    await db.delete(schema.leads);
    await db.delete(schema.properties);
    await db.delete(schema.users);
    console.log("✅ Dados limpos\n");

    // ============================================
    // CRIAR USUÁRIOS
    // ============================================
    console.log("👥 Criando usuários...");

    const adminPassword = await hashPassword("admin123456");
    const ownerPassword = await hashPassword("dono123456");
    const tenantPassword = await hashPassword("inquilino123456");

    const adminResult = await db.insert(schema.users).values({
      name: "Admin Sistema",
      email: "admin@imob.com",
      password: adminPassword,
      loginMethod: "local",
      role: "admin",
      createdAt: new Date(),
      updatedAt: new Date(),
      lastSignedIn: new Date(),
    });

    const ownerResult = await db.insert(schema.users).values({
      name: "João Silva (Proprietário)",
      email: "dono@teste.com",
      password: ownerPassword,
      loginMethod: "local",
      role: "user",
      createdAt: new Date(),
      updatedAt: new Date(),
      lastSignedIn: new Date(),
    });

    const tenantResult = await db.insert(schema.users).values({
      name: "Maria Santos (Inquilina)",
      email: "inquilino@teste.com",
      password: tenantPassword,
      loginMethod: "local",
      role: "user",
      createdAt: new Date(),
      updatedAt: new Date(),
      lastSignedIn: new Date(),
    });

    console.log("✅ Usuários criados\n");

    // ============================================
    // CRIAR IMÓVEIS
    // ============================================
    console.log("🏠 Criando imóveis...");

    const properties = [
      // Imóveis para Venda
      {
        title: "Apartamento Moderno no Plano Piloto",
        description: "Apartamento de luxo com 3 quartos, 2 suítes, vista para o Lago",
        referenceCode: "AP001",
        propertyType: "apartamento",
        transactionType: "venda",
        address: "SQN 308 Bloco A",
        neighborhood: "Asa Norte",
        city: "Brasília",
        state: "DF",
        zipCode: "70750-000",
        latitude: "-15.7839",
        longitude: "-47.8822",
        salePrice: 80000000, // R$ 800.000 em centavos
        bedrooms: 3,
        bathrooms: 2,
        suites: 2,
        parkingSpaces: 2,
        totalArea: 150,
        builtArea: 120,
        features: JSON.stringify(["piscina", "academia", "churrasqueira", "segurança 24h"]),
        mainImage: "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=500",
        status: "disponivel",
        published: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        title: "Casa Térrea em Águas Claras",
        description: "Casa com 4 quartos, piscina e terreno amplo",
        referenceCode: "CA001",
        propertyType: "casa",
        transactionType: "venda",
        address: "Rua das Flores, 123",
        neighborhood: "Águas Claras",
        city: "Brasília",
        state: "DF",
        zipCode: "71936-000",
        latitude: "-15.7944",
        longitude: "-47.9234",
        salePrice: 120000000, // R$ 1.200.000 em centavos
        bedrooms: 4,
        bathrooms: 3,
        suites: 1,
        parkingSpaces: 3,
        totalArea: 500,
        builtArea: 300,
        features: JSON.stringify(["piscina", "churrasqueira", "garagem", "jardim"]),
        mainImage: "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=500",
        status: "disponivel",
        published: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        title: "Cobertura Duplex no Lago Sul",
        description: "Cobertura com 5 quartos e vista panorâmica",
        referenceCode: "CO001",
        propertyType: "cobertura",
        transactionType: "venda",
        address: "SQS 410 Bloco D",
        neighborhood: "Lago Sul",
        city: "Brasília",
        state: "DF",
        zipCode: "70240-000",
        latitude: "-15.8267",
        longitude: "-47.8822",
        salePrice: 200000000, // R$ 2.000.000 em centavos
        bedrooms: 5,
        bathrooms: 4,
        suites: 3,
        parkingSpaces: 4,
        totalArea: 400,
        builtArea: 350,
        features: JSON.stringify(["piscina", "sauna", "academia", "vista panorâmica"]),
        mainImage: "https://images.unsplash.com/photo-1512917774080-9b274b3f5798?w=500",
        status: "disponivel",
        published: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      // Imóveis para Aluguel
      {
        title: "Apartamento Aconchegante - Aluguel",
        description: "Apartamento 2 quartos, bem localizado",
        referenceCode: "AL001",
        propertyType: "apartamento",
        transactionType: "locacao",
        address: "Rua A, 456",
        neighborhood: "Asa Sul",
        city: "Brasília",
        state: "DF",
        zipCode: "70240-000",
        latitude: "-15.8000",
        longitude: "-47.8700",
        rentPrice: 300000, // R$ 3.000 em centavos
        bedrooms: 2,
        bathrooms: 1,
        suites: 1,
        parkingSpaces: 1,
        totalArea: 80,
        builtArea: 70,
        features: JSON.stringify(["varanda", "cozinha planejada"]),
        mainImage: "https://images.unsplash.com/photo-1554995207-c18210cc9b1d?w=500",
        status: "alugado",
        published: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        title: "Kitnet Centro",
        description: "Kitnet para estudantes ou profissionais",
        referenceCode: "KN001",
        propertyType: "apartamento",
        transactionType: "locacao",
        address: "Rua B, 789",
        neighborhood: "Centro",
        city: "Brasília",
        state: "DF",
        zipCode: "70000-000",
        latitude: "-15.7975",
        longitude: "-47.8822",
        rentPrice: 150000, // R$ 1.500 em centavos
        bedrooms: 1,
        bathrooms: 1,
        suites: 0,
        parkingSpaces: 1,
        totalArea: 40,
        builtArea: 35,
        features: JSON.stringify(["bem localizado", "próximo ao metrô"]),
        mainImage: "https://images.unsplash.com/photo-1516455207990-7a41e1d4ffd5?w=500",
        status: "disponivel",
        published: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        title: "Casa Comercial",
        description: "Casa para uso comercial ou residencial",
        referenceCode: "CC001",
        propertyType: "comercial",
        transactionType: "locacao",
        address: "Rua C, 321",
        neighborhood: "Asa Norte",
        city: "Brasília",
        state: "DF",
        zipCode: "70750-000",
        latitude: "-15.7839",
        longitude: "-47.8822",
        rentPrice: 500000, // R$ 5.000 em centavos
        bedrooms: 3,
        bathrooms: 2,
        suites: 0,
        parkingSpaces: 2,
        totalArea: 200,
        builtArea: 150,
        features: JSON.stringify(["recepção", "salas", "estacionamento"]),
        mainImage: "https://images.unsplash.com/photo-1553531088-be0c60dd8fbe?w=500",
        status: "disponivel",
        published: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ];

    const insertedProperties = [];
    for (const prop of properties) {
      const result = await db.insert(schema.properties).values(prop);
      insertedProperties.push(result);
    }

    console.log(`✅ ${properties.length} imóveis criados\n`);

    // ============================================
    // CRIAR LEADS
    // ============================================
    console.log("📞 Criando leads...");

    const leads = [
      {
        name: "Carlos Oliveira",
        email: "carlos@email.com",
        phone: "(61) 98765-4321",
        whatsapp: "(61) 98765-4321",
        source: "site",
        stage: "novo",
        clientType: "comprador",
        qualification: "quente",
        buyerProfile: "primeira_casa",
        urgencyLevel: "alta",
        budgetMin: 50000000,
        budgetMax: 150000000,
        preferredNeighborhoods: JSON.stringify(["Asa Norte", "Lago Sul"]),
        preferredPropertyTypes: JSON.stringify(["apartamento", "casa"]),
        notes: "Cliente interessado em imóvel de luxo",
        tags: JSON.stringify(["vip", "urgente"]),
        score: 85,
        priority: "alta",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: "Ana Silva",
        email: "ana@email.com",
        phone: "(61) 99876-5432",
        whatsapp: "(61) 99876-5432",
        source: "whatsapp",
        stage: "qualificado",
        clientType: "locatario",
        qualification: "morno",
        buyerProfile: "indeciso",
        urgencyLevel: "media",
        budgetMin: 200000,
        budgetMax: 500000,
        preferredNeighborhoods: JSON.stringify(["Asa Sul", "Centro"]),
        preferredPropertyTypes: JSON.stringify(["apartamento"]),
        notes: "Procura aluguel para 2 pessoas",
        tags: JSON.stringify(["aluguel"]),
        score: 60,
        priority: "media",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: "Pedro Santos",
        email: "pedro@email.com",
        phone: "(61) 91234-5678",
        whatsapp: "(61) 91234-5678",
        source: "indicacao",
        stage: "visita_agendada",
        clientType: "investidor",
        qualification: "quente",
        buyerProfile: "investidor",
        urgencyLevel: "media",
        budgetMin: 100000000,
        budgetMax: 300000000,
        preferredNeighborhoods: JSON.stringify(["Águas Claras", "Lago Sul"]),
        preferredPropertyTypes: JSON.stringify(["apartamento", "cobertura"]),
        notes: "Investidor procurando imóvel para aluguel",
        tags: JSON.stringify(["investidor", "aluguel"]),
        score: 75,
        priority: "alta",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: "Mariana Costa",
        email: "mariana@email.com",
        phone: "(61) 92345-6789",
        whatsapp: "(61) 92345-6789",
        source: "google",
        stage: "contato_inicial",
        clientType: "comprador",
        qualification: "frio",
        buyerProfile: "curioso",
        urgencyLevel: "baixa",
        budgetMin: 30000000,
        budgetMax: 80000000,
        preferredNeighborhoods: JSON.stringify(["Asa Norte"]),
        preferredPropertyTypes: JSON.stringify(["apartamento"]),
        notes: "Primeiro contato, ainda explorando opções",
        tags: JSON.stringify(["novo"]),
        score: 40,
        priority: "baixa",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: "Roberto Mendes",
        email: "roberto@email.com",
        phone: "(61) 93456-7890",
        whatsapp: "(61) 93456-7890",
        source: "site",
        stage: "negociacao",
        clientType: "comprador",
        qualification: "quente",
        buyerProfile: "upgrade",
        urgencyLevel: "alta",
        budgetMin: 80000000,
        budgetMax: 200000000,
        preferredNeighborhoods: JSON.stringify(["Lago Sul", "Asa Sul"]),
        preferredPropertyTypes: JSON.stringify(["casa", "cobertura"]),
        notes: "Cliente em fase avançada de negociação",
        tags: JSON.stringify(["vip", "negociacao"]),
        score: 90,
        priority: "urgente",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: "Juliana Ferreira",
        email: "juliana@email.com",
        phone: "(61) 94567-8901",
        whatsapp: "(61) 94567-8901",
        source: "instagram",
        stage: "novo",
        clientType: "locatario",
        qualification: "nao_qualificado",
        buyerProfile: "curioso",
        urgencyLevel: "baixa",
        budgetMin: 150000,
        budgetMax: 400000,
        preferredNeighborhoods: JSON.stringify(["Centro", "Asa Sul"]),
        preferredPropertyTypes: JSON.stringify(["apartamento", "kitnet"]),
        notes: "Seguidor do Instagram, ainda explorando",
        tags: JSON.stringify(["social"]),
        score: 30,
        priority: "baixa",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: "Thiago Alves",
        email: "thiago@email.com",
        phone: "(61) 95678-9012",
        whatsapp: "(61) 95678-9012",
        source: "portal_vivareal",
        stage: "visita_realizada",
        clientType: "comprador",
        qualification: "morno",
        buyerProfile: "primeira_casa",
        urgencyLevel: "media",
        budgetMin: 60000000,
        budgetMax: 120000000,
        preferredNeighborhoods: JSON.stringify(["Águas Claras"]),
        preferredPropertyTypes: JSON.stringify(["casa"]),
        notes: "Visitou propriedade, aguardando retorno",
        tags: JSON.stringify(["visita"]),
        score: 65,
        priority: "media",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: "Fernanda Gomes",
        email: "fernanda@email.com",
        phone: "(61) 96789-0123",
        whatsapp: "(61) 96789-0123",
        source: "portal_zap",
        stage: "proposta",
        clientType: "comprador",
        qualification: "quente",
        buyerProfile: "investidor",
        urgencyLevel: "alta",
        budgetMin: 150000000,
        budgetMax: 250000000,
        preferredNeighborhoods: JSON.stringify(["Lago Sul"]),
        preferredPropertyTypes: JSON.stringify(["cobertura"]),
        notes: "Proposta enviada, aguardando resposta",
        tags: JSON.stringify(["proposta"]),
        score: 80,
        priority: "alta",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: "Lucas Martins",
        email: "lucas@email.com",
        phone: "(61) 97890-1234",
        whatsapp: "(61) 97890-1234",
        source: "outro",
        stage: "fechado_ganho",
        clientType: "comprador",
        qualification: "quente",
        buyerProfile: "primeira_casa",
        urgencyLevel: "alta",
        budgetMin: 70000000,
        budgetMax: 130000000,
        preferredNeighborhoods: JSON.stringify(["Asa Norte"]),
        preferredPropertyTypes: JSON.stringify(["apartamento"]),
        notes: "Venda fechada com sucesso",
        tags: JSON.stringify(["venda_fechada"]),
        score: 100,
        priority: "urgente",
        convertedAt: new Date(),
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: "Beatriz Rocha",
        email: "beatriz@email.com",
        phone: "(61) 98901-2345",
        whatsapp: "(61) 98901-2345",
        source: "facebook",
        stage: "fechado_perdido",
        clientType: "comprador",
        qualification: "frio",
        buyerProfile: "indeciso",
        urgencyLevel: "baixa",
        budgetMin: 40000000,
        budgetMax: 100000000,
        preferredNeighborhoods: JSON.stringify(["Asa Sul"]),
        preferredPropertyTypes: JSON.stringify(["apartamento"]),
        notes: "Cliente decidiu não prosseguir",
        tags: JSON.stringify(["perdido"]),
        score: 20,
        priority: "baixa",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ];

    const insertedLeads = [];
    for (const lead of leads) {
      const result = await db.insert(schema.leads).values(lead);
      insertedLeads.push(result);
    }

    console.log(`✅ ${leads.length} leads criados\n`);

    // ============================================
    // CRIAR CONTRATOS
    // ============================================
    console.log("📋 Criando contratos...");

    const contracts = [
      {
        propertyId: 4, // Apartamento Aconchegante
        tenantId: 3, // Maria Santos (Inquilina)
        ownerId: 2, // João Silva (Proprietário)
        status: "ACTIVE",
        rentAmount: 300000, // R$ 3.000 em centavos
        adminFeeRate: 10,
        startDate: new Date("2024-01-01"),
        paymentDay: 5,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        propertyId: 6, // Casa Comercial
        tenantId: 3, // Maria Santos
        ownerId: 2, // João Silva
        status: "ACTIVE",
        rentAmount: 500000, // R$ 5.000 em centavos
        adminFeeRate: 10,
        startDate: new Date("2024-02-01"),
        paymentDay: 10,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ];

    const insertedContracts = [];
    for (const contract of contracts) {
      const result = await db.insert(schema.contracts).values(contract);
      insertedContracts.push(result);
    }

    console.log(`✅ ${contracts.length} contratos criados\n`);

    // ============================================
    // CRIAR TRANSAÇÕES (6 meses)
    // ============================================
    console.log("💰 Criando transações (6 meses)...");

    const transactions = [];
    const now = new Date();

    // Gerar transações para os últimos 6 meses
    for (let month = 0; month < 6; month++) {
      const transactionDate = new Date(now.getFullYear(), now.getMonth() - month, 5);

      // Receitas de aluguel
      transactions.push({
        type: "revenue",
        category: "aluguel",
        amount: "300000", // R$ 3.000
        currency: "BRL",
        propertyId: 4,
        description: "Aluguel - Apartamento Aconchegante",
        status: month === 0 ? "pending" : "paid",
        paymentMethod: "transfer",
        paymentDate: month === 0 ? null : transactionDate,
        dueDate: transactionDate,
        createdAt: transactionDate,
        updatedAt: transactionDate,
      });

      transactions.push({
        type: "revenue",
        category: "aluguel",
        amount: "500000", // R$ 5.000
        currency: "BRL",
        propertyId: 6,
        description: "Aluguel - Casa Comercial",
        status: month === 0 ? "pending" : "paid",
        paymentMethod: "transfer",
        paymentDate: month === 0 ? null : transactionDate,
        dueDate: transactionDate,
        createdAt: transactionDate,
        updatedAt: transactionDate,
      });

      // Despesas
      if (month % 2 === 0) {
        transactions.push({
          type: "expense",
          category: "manutencao",
          amount: "50000", // R$ 500
          currency: "BRL",
          propertyId: 4,
          description: "Manutenção - Apartamento Aconchegante",
          status: "paid",
          paymentMethod: "transfer",
          paymentDate: transactionDate,
          dueDate: transactionDate,
          createdAt: transactionDate,
          updatedAt: transactionDate,
        });
      }

      // Repasses para proprietário (80% da receita)
      transactions.push({
        type: "transfer",
        category: "repasse",
        amount: "640000", // R$ 6.400 (80% de R$ 8.000)
        currency: "BRL",
        ownerId: 2,
        description: "Repasse ao proprietário",
        status: month === 0 ? "pending" : "paid",
        paymentMethod: "pix",
        paymentDate: month === 0 ? null : new Date(transactionDate.getTime() + 86400000 * 3),
        dueDate: new Date(transactionDate.getTime() + 86400000 * 3),
        createdAt: transactionDate,
        updatedAt: transactionDate,
      });
    }

    for (const transaction of transactions) {
      await db.insert(schema.transactions).values(transaction);
    }

    console.log(`✅ ${transactions.length} transações criadas\n`);

    // ============================================
    // CRIAR INSIGHTS DE LEADS
    // ============================================
    console.log("🧠 Criando insights de leads...");

    const insights = [
      {
        leadId: 1,
        sentimentScore: 85,
        aiSummary: "Cliente muito qualificado, mostra interesse genuíno em imóveis de luxo",
        lastInteraction: new Date(),
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        leadId: 3,
        sentimentScore: 75,
        aiSummary: "Investidor experiente, busca bom retorno financeiro",
        lastInteraction: new Date(),
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        leadId: 5,
        sentimentScore: 90,
        aiSummary: "Cliente em fase avançada de negociação, muito comprometido",
        lastInteraction: new Date(),
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ];

    for (const insight of insights) {
      await db.insert(schema.leadInsights).values(insight);
    }

    console.log(`✅ ${insights.length} insights criados\n`);

    console.log("🎉 Seed de dados completo com sucesso!");
    console.log("\n📊 Resumo:");
    console.log(`   - 3 Usuários criados`);
    console.log(`   - 6 Imóveis criados (3 venda, 3 aluguel)`);
    console.log(`   - 10 Leads criados`);
    console.log(`   - 2 Contratos ativos`);
    console.log(`   - ${transactions.length} Transações (6 meses)`);
    console.log(`   - 3 Insights de leads`);
    console.log("\n🔐 Credenciais de teste:");
    console.log("   Admin: admin@imob.com / admin123456");
    console.log("   Proprietário: dono@teste.com / dono123456");
    console.log("   Inquilino: inquilino@teste.com / inquilino123456");
  } catch (error) {
    console.error("❌ Erro ao fazer seed:", error);
    throw error;
  } finally {
    await connection.end();
  }
}

// Executar seed
seedDatabase().catch(console.error);
