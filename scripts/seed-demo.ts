import { getDb } from "../server/db";
import { users, properties, leads, contracts, transactions, blogPosts } from "../drizzle/schema";
import { hashPassword } from "../server/auth";

async function seedDatabase() {
  try {
    console.log("🌱 Iniciando seed de dados de demonstração...\n");

    const db = await getDb();
    if (!db) {
      throw new Error("Falha ao conectar ao banco de dados");
    }

    // ============================================
    // 1. CRIAR USUÁRIO ADMIN
    // ============================================
    console.log("📝 Criando usuário admin...");
    const adminPassword = await hashPassword("admin123");
    
    const adminResult = await db.insert(users).values({
      name: "Administrador",
      email: "admin@imob.com",
      password: adminPassword,
      loginMethod: "local",
      role: "admin",
    });

    const adminId = (adminResult as any).insertId || 1;
    console.log("✅ Admin criado: admin@imob.com\n");

    // ============================================
    // 2. CRIAR IMÓVEIS DE VENDA
    // ============================================
    console.log("🏠 Criando imóveis de venda...");
    
    const propertiesForSale = [
      {
        title: "Mansão Lago Sul",
        description: "Luxuosa mansão com 5 suítes, piscina e área de lazer completa",
        referenceCode: "MANS-001",
        propertyType: "casa" as const,
        transactionType: "venda" as const,
        price: 2500000,
        bedrooms: 5,
        bathrooms: 4,
        area: 450,
        address: "Lago Sul, Brasília - DF",
        imageUrl: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800",
        status: "ativo" as const,
      },
      {
        title: "Penthouse Asa Norte",
        description: "Apartamento de alto padrão com vista panorâmica de Brasília",
        referenceCode: "PENT-001",
        propertyType: "cobertura" as const,
        transactionType: "venda" as const,
        price: 1800000,
        bedrooms: 4,
        bathrooms: 3,
        area: 320,
        address: "Asa Norte, Brasília - DF",
        imageUrl: "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800",
        status: "ativo" as const,
      },
      {
        title: "Apartamento Águas Claras",
        description: "Moderno apartamento com 3 quartos e garagem dupla",
        referenceCode: "APAR-001",
        propertyType: "apartamento" as const,
        transactionType: "venda" as const,
        price: 850000,
        bedrooms: 3,
        bathrooms: 2,
        area: 120,
        address: "Águas Claras, Brasília - DF",
        imageUrl: "https://images.unsplash.com/photo-1545324418-cc1a9a6fded0?w=800",
        status: "ativo" as const,
      },
    ];

    await db.insert(properties).values(propertiesForSale);
    console.log("✅ 3 imóveis de venda criados\n");

    // ============================================
    // 3. CRIAR IMÓVEIS DE ALUGUEL
    // ============================================
    console.log("🏘️ Criando imóveis de aluguel...");
    
    const propertiesForRent = [
      {
        title: "Apartamento Águas Claras - Aluguel",
        description: "Aconchegante apartamento com 2 quartos, ideal para casal ou pequena família",
        referenceCode: "ALUG-001",
        propertyType: "apartamento" as const,
        transactionType: "locacao" as const,
        rentAmount: 2500,
        bedrooms: 2,
        bathrooms: 1,
        area: 85,
        address: "Águas Claras, Brasília - DF",
        imageUrl: "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800",
        status: "ativo" as const,
      },
      {
        title: "Apartamento Taguatinga - Aluguel",
        description: "Espaçoso apartamento com 3 quartos e área de serviço",
        referenceCode: "ALUG-002",
        propertyType: "apartamento" as const,
        transactionType: "locacao" as const,
        rentAmount: 1800,
        bedrooms: 3,
        bathrooms: 2,
        area: 110,
        address: "Taguatinga, Brasília - DF",
        imageUrl: "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800",
        status: "ativo" as const,
      },
      {
        title: "Casa Sobradinho - Aluguel",
        description: "Confortável casa com 4 quartos, quintal e garagem",
        referenceCode: "ALUG-003",
        propertyType: "casa" as const,
        transactionType: "locacao" as const,
        rentAmount: 3200,
        bedrooms: 4,
        bathrooms: 2,
        area: 180,
        address: "Sobradinho, Brasília - DF",
        imageUrl: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800",
        status: "ativo" as const,
      },
    ];

    await db.insert(properties).values(propertiesForRent);
    console.log("✅ 3 imóveis de aluguel criados\n");

    // ============================================
    // 4. CRIAR LEADS
    // ============================================
    console.log("👥 Criando leads para o CRM...");
    
    const leadsData = [
      {
        name: "João Silva",
        email: "joao@email.com",
        phone: "(61) 98765-4321",
        source: "website" as const,
        status: "novo" as const,
        notes: "Interessado em imóveis de venda no Lago Sul",
      },
      {
        name: "Maria Santos",
        email: "maria@email.com",
        phone: "(61) 99876-5432",
        source: "telefone" as const,
        status: "em_negociacao" as const,
        notes: "Procurando apartamento para aluguel em Águas Claras",
      },
      {
        name: "Carlos Oliveira",
        email: "carlos@email.com",
        phone: "(61) 97654-3210",
        source: "indicacao" as const,
        status: "qualificado" as const,
        notes: "Investidor interessado em imóveis para aluguel",
      },
      {
        name: "Ana Costa",
        email: "ana@email.com",
        phone: "(61) 98765-4321",
        source: "website" as const,
        status: "novo" as const,
        notes: "Consultando sobre financiamento imobiliário",
      },
      {
        name: "Pedro Ferreira",
        email: "pedro@email.com",
        phone: "(61) 99876-5432",
        source: "redes_sociais" as const,
        status: "em_negociacao" as const,
        notes: "Interessado em penthouse na Asa Norte",
      },
    ];

    await db.insert(leads).values(leadsData);
    console.log("✅ 5 leads criados\n");

    // ============================================
    // 5. CRIAR CONTRATOS
    // ============================================
    console.log("📋 Criando contratos ativos...");
    
    const contractsData = [
      {
        propertyId: 4, // Primeiro imóvel de aluguel
        tenantId: adminId,
        ownerId: adminId,
        status: "ACTIVE" as const,
        rentAmount: 250000, // R$ 2.500 em centavos
        adminFeeRate: 10,
        paymentDay: 5,
      },
      {
        propertyId: 5, // Segundo imóvel de aluguel
        tenantId: adminId,
        ownerId: adminId,
        status: "ACTIVE" as const,
        rentAmount: 180000, // R$ 1.800 em centavos
        adminFeeRate: 10,
        paymentDay: 10,
      },
    ];

    await db.insert(contracts).values(contractsData);
    console.log("✅ 2 contratos criados\n");

    // ============================================
    // 6. CRIAR TRANSAÇÕES FINANCEIRAS
    // ============================================
    console.log("💰 Criando transações financeiras...");
    
    const today = new Date();
    const transactionsData = [];

    // Receitas de aluguel (últimos 6 meses)
    for (let i = 0; i < 6; i++) {
      const date = new Date(today);
      date.setMonth(date.getMonth() - i);
      
      transactionsData.push({
        type: "revenue" as const,
        category: "Aluguel Recebido",
        description: "Aluguel - Apartamento Águas Claras",
        amount: 250000, // R$ 2.500
        status: "paid" as const,
        dueDate: date,
        paymentDate: date,
        contractId: 1,
        propertyId: 4,
        userId: adminId,
      });

      transactionsData.push({
        type: "revenue" as const,
        category: "Aluguel Recebido",
        description: "Aluguel - Apartamento Taguatinga",
        amount: 180000, // R$ 1.800
        status: "paid" as const,
        dueDate: date,
        paymentDate: date,
        contractId: 2,
        propertyId: 5,
        userId: adminId,
      });

      // Despesas administrativas
      transactionsData.push({
        type: "expense" as const,
        category: "Manutenção",
        description: "Manutenção predial - Apartamento Águas Claras",
        amount: 50000, // R$ 500
        status: "paid" as const,
        dueDate: date,
        paymentDate: date,
        propertyId: 4,
        userId: adminId,
      });

      // Repasses ao proprietário
      transactionsData.push({
        type: "transfer" as const,
        category: "Repasse Proprietário",
        description: "Repasse mensal - Apartamento Águas Claras",
        amount: 225000, // R$ 2.250 (90% do aluguel)
        status: "paid" as const,
        dueDate: date,
        paymentDate: date,
        contractId: 1,
        propertyId: 4,
        userId: adminId,
      });
    }

    // Comissões
    transactionsData.push({
      type: "commission" as const,
      category: "Comissão de Venda",
      description: "Comissão - Venda Mansão Lago Sul",
      amount: 75000, // R$ 750
      status: "paid" as const,
      dueDate: new Date(),
      paymentDate: new Date(),
      propertyId: 1,
      userId: adminId,
    });

    if (transactionsData.length > 0) {
      await db.insert(transactions).values(transactionsData);
    }
    console.log(`✅ ${transactionsData.length} transações criadas\n`);

    // ============================================
    // 7. CRIAR POSTS DE BLOG
    // ============================================
    console.log("📰 Criando posts de blog...");
    
    const blogPostsData = [
      {
        title: "Como Financiar um Imóvel em Brasília",
        slug: "como-financiar-imovel-brasilia",
        content: "Guia completo sobre as melhores opções de financiamento imobiliário no Distrito Federal. Conheça as taxas dos principais bancos e como escolher a melhor opção para você.",
        excerpt: "Descubra as melhores formas de financiar seu imóvel em Brasília",
        author: "Casa DF",
        featured: true,
        published: true,
        status: "published" as const,
      },
      {
        title: "Dicas para Alugar um Imóvel com Segurança",
        slug: "dicas-alugar-imovel-seguranca",
        content: "Saiba quais são os cuidados essenciais ao alugar um imóvel. Desde a análise de documentos até a assinatura do contrato, confira todas as dicas importantes.",
        excerpt: "Proteja-se ao alugar um imóvel seguindo estas dicas",
        author: "Casa DF",
        featured: true,
        published: true,
        status: "published" as const,
      },
    ];

    await db.insert(blogPosts).values(blogPostsData);
    console.log("✅ 2 posts de blog criados\n");

    // ============================================
    // RESUMO FINAL
    // ============================================
    console.log("═══════════════════════════════════════════════════════");
    console.log("✅ SEED DE DADOS CONCLUÍDO COM SUCESSO!");
    console.log("═══════════════════════════════════════════════════════\n");
    
    console.log("📊 DADOS INSERIDOS:");
    console.log(`   • 1 Usuário Admin (admin@imob.com / admin123)`);
    console.log(`   • 6 Imóveis (3 venda + 3 aluguel)`);
    console.log(`   • 5 Leads`);
    console.log(`   • 2 Contratos Ativos`);
    console.log(`   • ${transactionsData.length} Transações Financeiras`);
    console.log(`   • 2 Posts de Blog\n`);

    console.log("💰 DADOS FINANCEIROS:");
    console.log(`   • Receita Total: R$ 4.300,00`);
    console.log(`   • Despesas: R$ 500,00`);
    console.log(`   • Repasses: R$ 2.250,00`);
    console.log(`   • Comissões: R$ 750,00\n`);

    console.log("🔐 CREDENCIAIS DE LOGIN:");
    console.log(`   • Email: admin@imob.com`);
    console.log(`   • Senha: admin123\n`);

    process.exit(0);
  } catch (error) {
    console.error("❌ Erro ao fazer seed:", error);
    process.exit(1);
  }
}

seedDatabase();
