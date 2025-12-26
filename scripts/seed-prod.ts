/**
 * Script de Seed para Produção
 * Popula o banco com dados de demonstração
 */

import { getDb } from "../server/db";
import { users, properties, leads, contracts, transactions, blogPosts } from "../drizzle/schema";
import { eq } from "drizzle-orm";

async function seedDatabase() {
  try {
    const db = getDb();
    console.log("🌱 Iniciando seed de dados...\n");

    // ============================================
    // 1. CRIAR USUÁRIO ADMIN
    // ============================================
    console.log("📝 Criando usuário admin...");
    const { hashPassword } = await import("../server/auth");
    const adminPassword = await hashPassword("admin123");
    
    const existingAdmin = await db.query.users.findFirst({
      where: eq(users.email, "admin@casadf.com.br"),
    });

    let adminId: number;
    if (!existingAdmin) {
      const [admin] = await db
        .insert(users)
        .values({
          name: "Administrador CasaDF",
          email: "admin@casadf.com.br",
          password: adminPassword,
          role: "admin",
          loginMethod: "local",
        })
        .$returningId();
      adminId = admin.id;
      console.log(`✅ Admin criado: admin@casadf.com.br\n`);
    } else {
      adminId = existingAdmin.id;
      console.log(`✅ Admin já existe\n`);
    }

    // ============================================
    // 2. CRIAR PROPRIETÁRIOS
    // ============================================
    console.log("🏠 Criando proprietários...");
    const ownerPassword = await hashPassword("123456");
    
    const owners = [];
    for (let i = 1; i <= 3; i++) {
      const existingOwner = await db.query.users.findFirst({
        where: eq(users.email, `proprietario${i}@casadf.com.br`),
      });

      if (!existingOwner) {
        const [owner] = await db
          .insert(users)
          .values({
            name: `Proprietário ${i}`,
            email: `proprietario${i}@casadf.com.br`,
            password: ownerPassword,
            role: "user",
            loginMethod: "local",
          })
          .$returningId();
        owners.push(owner.id);
      } else {
        owners.push(existingOwner.id);
      }
    }
    console.log(`✅ ${owners.length} proprietários criados\n`);

    // ============================================
    // 3. CRIAR IMÓVEIS (Venda e Aluguel)
    // ============================================
    console.log("🏢 Criando imóveis...");
    const propertyData = [
      {
        title: "Mansão Lago Sul - Venda",
        description: "Luxuosa mansão com 5 suítes, piscina e área de lazer completa",
        propertyType: "casa",
        transactionType: "venda",
        salePrice: 250000000, // R$ 2.5M em centavos
        bedrooms: 5,
        bathrooms: 4,
        totalArea: 450,
        address: "Lago Sul, Brasília - DF",
        neighborhood: "Lago Sul",
        city: "Brasília",
        state: "DF",
        mainImage: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800",
        status: "disponivel",
        featured: true,
        published: true,
      },
      {
        title: "Penthouse Asa Norte - Venda",
        description: "Apartamento de alto padrão com vista panorâmica de Brasília",
        propertyType: "cobertura",
        transactionType: "venda",
        salePrice: 180000000, // R$ 1.8M
        bedrooms: 4,
        bathrooms: 3,
        totalArea: 320,
        address: "Asa Norte, Brasília - DF",
        neighborhood: "Asa Norte",
        city: "Brasília",
        state: "DF",
        mainImage: "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800",
        status: "disponivel",
        featured: true,
        published: true,
      },
      {
        title: "Apartamento Águas Claras - Venda",
        description: "Moderno apartamento com 3 quartos e garagem dupla",
        propertyType: "apartamento",
        transactionType: "venda",
        salePrice: 85000000, // R$ 850k
        bedrooms: 3,
        bathrooms: 2,
        totalArea: 120,
        address: "Águas Claras, Brasília - DF",
        neighborhood: "Águas Claras",
        city: "Brasília",
        state: "DF",
        mainImage: "https://images.unsplash.com/photo-1545324418-cc1a9a6fded0?w=800",
        status: "disponivel",
        featured: false,
        published: true,
      },
      {
        title: "Apartamento Águas Claras - Aluguel",
        description: "Aconchegante apartamento com 2 quartos",
        propertyType: "apartamento",
        transactionType: "locacao",
        rentPrice: 250000, // R$ 2.500/mês
        bedrooms: 2,
        bathrooms: 1,
        totalArea: 85,
        address: "Águas Claras, Brasília - DF",
        neighborhood: "Águas Claras",
        city: "Brasília",
        state: "DF",
        mainImage: "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800",
        status: "alugado",
        featured: false,
        published: true,
      },
      {
        title: "Apartamento Taguatinga - Aluguel",
        description: "Espaçoso apartamento com 3 quartos",
        propertyType: "apartamento",
        transactionType: "locacao",
        rentPrice: 180000, // R$ 1.800/mês
        bedrooms: 3,
        bathrooms: 2,
        totalArea: 110,
        address: "Taguatinga, Brasília - DF",
        neighborhood: "Taguatinga",
        city: "Brasília",
        state: "DF",
        mainImage: "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800",
        status: "alugado",
        featured: false,
        published: true,
      },
      {
        title: "Casa Sobradinho - Aluguel",
        description: "Confortável casa com 4 quartos",
        propertyType: "casa",
        transactionType: "locacao",
        rentPrice: 320000, // R$ 3.200/mês
        bedrooms: 4,
        bathrooms: 2,
        totalArea: 180,
        address: "Sobradinho, Brasília - DF",
        neighborhood: "Sobradinho",
        city: "Brasília",
        state: "DF",
        mainImage: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800",
        status: "alugado",
        featured: false,
        published: true,
      },
    ];

    const createdProperties = [];
    for (const prop of propertyData) {
      const existing = await db.query.properties.findFirst({
        where: eq(properties.title, prop.title),
      });

      if (!existing) {
        const [property] = await db
          .insert(properties)
          .values({ ...prop, createdBy: adminId })
          .$returningId();
        createdProperties.push(property.id);
      }
    }
    console.log(`✅ ${createdProperties.length} imóveis criados\n`);

    // ============================================
    // 4. CRIAR LEADS
    // ============================================
    console.log("👥 Criando leads...");
    const leadData = [
      {
        name: "João Silva",
        email: "joao@email.com",
        phone: "(61) 98765-4321",
        whatsapp: "61987654321",
        source: "website",
        stage: "novo",
        budgetMin: 500000,
        budgetMax: 1000000,
        preferredPropertyTypes: "apartamento",
        notes: "Interessado em imóveis de venda no Lago Sul",
      },
      {
        name: "Maria Santos",
        email: "maria@email.com",
        phone: "(61) 99876-5432",
        whatsapp: "61998765432",
        source: "whatsapp",
        stage: "qualificado",
        budgetMin: 200000,
        budgetMax: 400000,
        preferredPropertyTypes: "apartamento",
        notes: "Procurando apartamento para aluguel em Águas Claras",
      },
      {
        name: "Carlos Oliveira",
        email: "carlos@email.com",
        phone: "(61) 97654-3210",
        whatsapp: "61976543210",
        source: "indicacao",
        stage: "em_negociacao",
        budgetMin: 1000000,
        budgetMax: 2000000,
        preferredPropertyTypes: "casa",
        notes: "Investidor interessado em imóveis para aluguel",
      },
      {
        name: "Ana Costa",
        email: "ana@email.com",
        phone: "(61) 98765-4321",
        whatsapp: "61987654321",
        source: "website",
        stage: "novo",
        budgetMin: 300000,
        budgetMax: 600000,
        preferredPropertyTypes: "apartamento",
        notes: "Consultando sobre financiamento imobiliário",
      },
      {
        name: "Pedro Ferreira",
        email: "pedro@email.com",
        phone: "(61) 99876-5432",
        whatsapp: "61998765432",
        source: "google",
        stage: "em_negociacao",
        budgetMin: 1500000,
        budgetMax: 2500000,
        preferredPropertyTypes: "cobertura",
        notes: "Interessado em penthouse na Asa Norte",
      },
    ];

    const createdLeads = [];
    for (const lead of leadData) {
      const existing = await db.query.leads.findFirst({
        where: eq(leads.email, lead.email),
      });

      if (!existing) {
        const [newLead] = await db
          .insert(leads)
          .values(lead)
          .$returningId();
        createdLeads.push(newLead.id);
      }
    }
    console.log(`✅ ${createdLeads.length} leads criados\n`);

    // ============================================
    // 5. CRIAR CONTRATOS
    // ============================================
    console.log("📋 Criando contratos...");
    const contractData = [
      {
        propertyId: createdProperties[3], // Apartamento Águas Claras - Aluguel
        tenantId: owners[0],
        ownerId: owners[0],
        status: "ACTIVE",
        rentAmount: 250000, // R$ 2.500
        adminFeeRate: 10,
        paymentDay: 5,
      },
      {
        propertyId: createdProperties[4], // Apartamento Taguatinga - Aluguel
        tenantId: owners[1],
        ownerId: owners[1],
        status: "ACTIVE",
        rentAmount: 180000, // R$ 1.800
        adminFeeRate: 10,
        paymentDay: 5,
      },
      {
        propertyId: createdProperties[5], // Casa Sobradinho - Aluguel
        tenantId: owners[2],
        ownerId: owners[2],
        status: "ACTIVE",
        rentAmount: 320000, // R$ 3.200
        adminFeeRate: 10,
        paymentDay: 5,
      },
    ];

    const createdContracts = [];
    for (const contract of contractData) {
      const [newContract] = await db
        .insert(contracts)
        .values(contract)
        .$returningId();
      createdContracts.push(newContract.id);
    }
    console.log(`✅ ${createdContracts.length} contratos criados\n`);

    // ============================================
    // 6. CRIAR TRANSAÇÕES FINANCEIRAS
    // ============================================
    console.log("💰 Criando transações financeiras...");
    const transactionData = [];
    const months = 6;
    const today = new Date();

    for (let m = 0; m < months; m++) {
      const date = new Date(today.getFullYear(), today.getMonth() - m, 20);
      
      // Aluguel Apartamento Águas Claras
      transactionData.push({
        type: "revenue",
        category: "rent_income",
        amount: "250.00",
        currency: "BRL",
        description: "Aluguel - Apartamento Águas Claras",
        status: m === 0 ? "pending" : "paid",
        dueDate: date,
        paymentDate: m === 0 ? null : date,
        contractId: createdContracts[0],
        propertyId: createdProperties[3],
      });

      // Taxa administrativa
      transactionData.push({
        type: "expense",
        category: "admin_fee",
        amount: "25.00",
        currency: "BRL",
        description: "Taxa Administrativa (10%) - Apartamento Águas Claras",
        status: m === 0 ? "pending" : "paid",
        dueDate: date,
        paymentDate: m === 0 ? null : date,
        contractId: createdContracts[0],
        propertyId: createdProperties[3],
      });

      // Repasse ao proprietário
      transactionData.push({
        type: "transfer",
        category: "owner_transfer",
        amount: "225.00",
        currency: "BRL",
        description: "Repasse ao Proprietário - Apartamento Águas Claras",
        status: m === 0 ? "pending" : "paid",
        dueDate: date,
        paymentDate: m === 0 ? null : date,
        contractId: createdContracts[0],
        propertyId: createdProperties[3],
      });

      // Aluguel Apartamento Taguatinga
      transactionData.push({
        type: "revenue",
        category: "rent_income",
        amount: "180.00",
        currency: "BRL",
        description: "Aluguel - Apartamento Taguatinga",
        status: m === 0 ? "pending" : "paid",
        dueDate: date,
        paymentDate: m === 0 ? null : date,
        contractId: createdContracts[1],
        propertyId: createdProperties[4],
      });

      // Aluguel Casa Sobradinho
      transactionData.push({
        type: "revenue",
        category: "rent_income",
        amount: "320.00",
        currency: "BRL",
        description: "Aluguel - Casa Sobradinho",
        status: m === 0 ? "pending" : "paid",
        dueDate: date,
        paymentDate: m === 0 ? null : date,
        contractId: createdContracts[2],
        propertyId: createdProperties[5],
      });
    }

    for (const trans of transactionData) {
      await db.insert(transactions).values(trans);
    }
    console.log(`✅ ${transactionData.length} transações criadas\n`);

    // ============================================
    // 7. CRIAR POSTS DE BLOG
    // ============================================
    console.log("📰 Criando posts de blog...");
    const blogData = [
      {
        title: "Como Financiar um Imóvel em Brasília",
        slug: "como-financiar-imovel-brasilia",
        content: "Guia completo sobre as melhores opções de financiamento imobiliário no Distrito Federal. Conheça as taxas dos principais bancos e como escolher a melhor opção para você.",
        excerpt: "Descubra as melhores formas de financiar seu imóvel em Brasília",
        author: "Casa DF",
        featured: true,
        published: true,
        status: "published",
      },
      {
        title: "Dicas para Alugar um Imóvel com Segurança",
        slug: "dicas-alugar-imovel-seguranca",
        content: "Saiba quais são os cuidados essenciais ao alugar um imóvel. Desde a análise de documentos até a assinatura do contrato, confira todas as dicas importantes.",
        excerpt: "Proteja-se ao alugar um imóvel seguindo estas dicas",
        author: "Casa DF",
        featured: true,
        published: true,
        status: "published",
      },
    ];

    for (const blog of blogData) {
      const existing = await db.query.blogPosts.findFirst({
        where: eq(blogPosts.slug, blog.slug),
      });

      if (!existing) {
        await db.insert(blogPosts).values(blog);
      }
    }
    console.log(`✅ ${blogData.length} posts de blog criados\n`);

    console.log("✅ ✅ ✅ SEED CONCLUÍDO COM SUCESSO! ✅ ✅ ✅\n");
    console.log("📊 Resumo:");
    console.log(`   - 1 Admin (admin@casadf.com.br / admin123)`);
    console.log(`   - 3 Proprietários`);
    console.log(`   - 6 Imóveis (3 venda + 3 aluguel)`);
    console.log(`   - 5 Leads`);
    console.log(`   - 3 Contratos Ativos`);
    console.log(`   - ${transactionData.length} Transações Financeiras`);
    console.log(`   - 2 Posts de Blog\n`);

    process.exit(0);
  } catch (error) {
    console.error("❌ Erro durante seed:", error);
    process.exit(1);
  }
}

seedDatabase();
