import Database from "better-sqlite3";
import { hashPassword } from "../server/auth";
import path from "path";

async function seedDatabase() {
  try {
    console.log("🌱 Iniciando seed de dados de demonstração (SQLite)...\n");

    // Criar banco SQLite
    const dbPath = path.join(process.cwd(), "demo.db");
    const db = new Database(dbPath);

    // Criar tabelas básicas
    db.exec(`
      CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        email TEXT UNIQUE NOT NULL,
        password TEXT,
        role TEXT DEFAULT 'user',
        createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
      );

      CREATE TABLE IF NOT EXISTS properties (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        title TEXT NOT NULL,
        description TEXT,
        propertyType TEXT,
        transactionType TEXT,
        price INTEGER,
        rentAmount INTEGER,
        bedrooms INTEGER,
        bathrooms INTEGER,
        area INTEGER,
        address TEXT,
        imageUrl TEXT,
        status TEXT DEFAULT 'ativo',
        createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
      );

      CREATE TABLE IF NOT EXISTS leads (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        email TEXT,
        phone TEXT,
        source TEXT,
        status TEXT,
        notes TEXT,
        createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
      );

      CREATE TABLE IF NOT EXISTS transactions (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        type TEXT,
        category TEXT,
        description TEXT,
        amount INTEGER,
        status TEXT,
        userId INTEGER,
        propertyId INTEGER,
        createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
      );

      CREATE TABLE IF NOT EXISTS blog_posts (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        title TEXT NOT NULL,
        slug TEXT UNIQUE,
        content TEXT,
        excerpt TEXT,
        author TEXT,
        published BOOLEAN DEFAULT 0,
        createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
      );
    `);

    console.log("📝 Criando usuário admin...");
    const adminPassword = await hashPassword("admin123");
    
    db.prepare(`
      INSERT OR IGNORE INTO users (name, email, password, role) 
      VALUES (?, ?, ?, ?)
    `).run("Administrador", "admin@imob.com", adminPassword, "admin");

    console.log("✅ Admin criado: admin@imob.com\n");

    console.log("🏠 Criando imóveis...");
    const properties = [
      ["Mansão Lago Sul", "Luxuosa mansão com 5 suítes", "casa", "venda", 2500000, null, 5, 4, 450, "Lago Sul, DF", "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800", "ativo"],
      ["Penthouse Asa Norte", "Apartamento de alto padrão", "cobertura", "venda", 1800000, null, 4, 3, 320, "Asa Norte, DF", "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800", "ativo"],
      ["Apartamento Águas Claras", "Moderno apartamento com 3 quartos", "apartamento", "venda", 850000, null, 3, 2, 120, "Águas Claras, DF", "https://images.unsplash.com/photo-1545324418-cc1a9a6fded0?w=800", "ativo"],
      ["Apartamento Águas Claras - Aluguel", "Aconchegante apartamento", "apartamento", "locacao", null, 2500, 2, 1, 85, "Águas Claras, DF", "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800", "ativo"],
      ["Apartamento Taguatinga - Aluguel", "Espaçoso apartamento", "apartamento", "locacao", null, 1800, 3, 2, 110, "Taguatinga, DF", "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800", "ativo"],
      ["Casa Sobradinho - Aluguel", "Confortável casa", "casa", "locacao", null, 3200, 4, 2, 180, "Sobradinho, DF", "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800", "ativo"],
    ];

    const insertProperty = db.prepare(`
      INSERT INTO properties (title, description, propertyType, transactionType, price, rentAmount, bedrooms, bathrooms, area, address, imageUrl, status) 
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

    properties.forEach(p => insertProperty.run(...p));
    console.log("✅ 6 imóveis criados\n");

    console.log("👥 Criando leads...");
    const leads = [
      ["João Silva", "joao@email.com", "(61) 98765-4321", "website", "novo", "Interessado em Lago Sul"],
      ["Maria Santos", "maria@email.com", "(61) 99876-5432", "telefone", "em_negociacao", "Procurando aluguel"],
      ["Carlos Oliveira", "carlos@email.com", "(61) 97654-3210", "indicacao", "qualificado", "Investidor"],
      ["Ana Costa", "ana@email.com", "(61) 98765-4321", "website", "novo", "Consultando financiamento"],
      ["Pedro Ferreira", "pedro@email.com", "(61) 99876-5432", "redes_sociais", "em_negociacao", "Interessado em penthouse"],
    ];

    const insertLead = db.prepare(`
      INSERT INTO leads (name, email, phone, source, status, notes) 
      VALUES (?, ?, ?, ?, ?, ?)
    `);

    leads.forEach(l => insertLead.run(...l));
    console.log("✅ 5 leads criados\n");

    console.log("💰 Criando transações...");
    const transactions = [
      ["revenue", "Aluguel Recebido", "Aluguel - Apt Águas Claras", 250000, "paid", 1, 4],
      ["revenue", "Aluguel Recebido", "Aluguel - Apt Taguatinga", 180000, "paid", 1, 5],
      ["expense", "Manutenção", "Manutenção predial", 50000, "paid", 1, 4],
      ["transfer", "Repasse Proprietário", "Repasse mensal", 225000, "paid", 1, 4],
      ["commission", "Comissão de Venda", "Comissão - Mansão", 75000, "paid", 1, 1],
    ];

    const insertTransaction = db.prepare(`
      INSERT INTO transactions (type, category, description, amount, status, userId, propertyId) 
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `);

    transactions.forEach(t => insertTransaction.run(...t));
    console.log("✅ 5 transações criadas\n");

    console.log("📰 Criando posts de blog...");
    const posts = [
      ["Como Financiar um Imóvel em Brasília", "como-financiar-imovel-brasilia", "Guia completo...", "Descubra as melhores formas", "Casa DF", 1],
      ["Dicas para Alugar com Segurança", "dicas-alugar-imovel-seguranca", "Saiba os cuidados...", "Proteja-se ao alugar", "Casa DF", 1],
    ];

    const insertPost = db.prepare(`
      INSERT INTO blog_posts (title, slug, content, excerpt, author, published) 
      VALUES (?, ?, ?, ?, ?, ?)
    `);

    posts.forEach(p => insertPost.run(...p));
    console.log("✅ 2 posts de blog criados\n");

    db.close();

    console.log("═══════════════════════════════════════════════════════");
    console.log("✅ SEED DE DADOS CONCLUÍDO COM SUCESSO!");
    console.log("═══════════════════════════════════════════════════════\n");
    
    console.log("📊 DADOS INSERIDOS:");
    console.log(`   • 1 Usuário Admin`);
    console.log(`   • 6 Imóveis`);
    console.log(`   • 5 Leads`);
    console.log(`   • 5 Transações`);
    console.log(`   • 2 Posts de Blog\n`);

    console.log("🔐 CREDENCIAIS DE LOGIN:");
    console.log(`   • Email: admin@imob.com`);
    console.log(`   • Senha: admin123\n`);

    console.log("📍 Banco de dados: demo.db\n");

    process.exit(0);
  } catch (error) {
    console.error("❌ Erro:", error);
    process.exit(1);
  }
}

seedDatabase();
