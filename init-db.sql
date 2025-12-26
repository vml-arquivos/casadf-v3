-- ============================================
-- Inicialização do Banco de Dados
-- ============================================

-- Criar banco de dados se não existir
CREATE DATABASE IF NOT EXISTS casadf CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- Usar o banco de dados
USE casadf;

-- Criar usuário com permissões
CREATE USER IF NOT EXISTS 'user'@'%' IDENTIFIED BY 'password';
GRANT ALL PRIVILEGES ON casadf.* TO 'user'@'%';
FLUSH PRIVILEGES;

-- ============================================
-- Tabelas Base (Drizzle ORM irá gerenciar)
-- ============================================

-- Tabela de Usuários
CREATE TABLE IF NOT EXISTS users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  password VARCHAR(255),
  role VARCHAR(50) DEFAULT 'user',
  loginMethod VARCHAR(50) DEFAULT 'local',
  openId VARCHAR(255),
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Tabela de Imóveis
CREATE TABLE IF NOT EXISTS properties (
  id INT AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  description LONGTEXT,
  referenceCode VARCHAR(50) UNIQUE,
  propertyType VARCHAR(50),
  transactionType VARCHAR(50),
  price INT,
  rentAmount INT,
  bedrooms INT,
  bathrooms INT,
  area INT,
  address VARCHAR(255),
  city VARCHAR(100),
  neighborhood VARCHAR(100),
  imageUrl VARCHAR(500),
  status VARCHAR(50) DEFAULT 'ativo',
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Tabela de Leads
CREATE TABLE IF NOT EXISTS leads (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255),
  phone VARCHAR(20),
  source VARCHAR(50),
  status VARCHAR(50) DEFAULT 'novo',
  notes LONGTEXT,
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Tabela de Contratos
CREATE TABLE IF NOT EXISTS contracts (
  id INT AUTO_INCREMENT PRIMARY KEY,
  propertyId INT,
  tenantId INT,
  ownerId INT,
  status VARCHAR(50) DEFAULT 'ACTIVE',
  rentAmount INT,
  adminFeeRate INT DEFAULT 10,
  paymentDay INT DEFAULT 5,
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (propertyId) REFERENCES properties(id),
  FOREIGN KEY (tenantId) REFERENCES users(id),
  FOREIGN KEY (ownerId) REFERENCES users(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Tabela de Transações Financeiras
CREATE TABLE IF NOT EXISTS transactions (
  id INT AUTO_INCREMENT PRIMARY KEY,
  type VARCHAR(50),
  category VARCHAR(100),
  description VARCHAR(255),
  amount INT,
  status VARCHAR(50) DEFAULT 'pending',
  dueDate DATETIME,
  paymentDate DATETIME,
  contractId INT,
  propertyId INT,
  userId INT,
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (contractId) REFERENCES contracts(id),
  FOREIGN KEY (propertyId) REFERENCES properties(id),
  FOREIGN KEY (userId) REFERENCES users(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Tabela de Blog Posts
CREATE TABLE IF NOT EXISTS blog_posts (
  id INT AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  slug VARCHAR(255) UNIQUE,
  content LONGTEXT,
  excerpt VARCHAR(500),
  author VARCHAR(100),
  featured BOOLEAN DEFAULT 0,
  published BOOLEAN DEFAULT 0,
  status VARCHAR(50) DEFAULT 'draft',
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Criar índices para performance
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_properties_status ON properties(status);
CREATE INDEX idx_leads_status ON leads(status);
CREATE INDEX idx_transactions_userId ON transactions(userId);
CREATE INDEX idx_transactions_propertyId ON transactions(propertyId);
CREATE INDEX idx_blog_posts_slug ON blog_posts(slug);

-- ============================================
-- Dados de Demonstração (Seed)
-- ============================================

-- Inserir Admin
INSERT IGNORE INTO users (name, email, password, role, loginMethod) VALUES 
('Administrador', 'admin@imob.com', '$2a$10$YourHashedPasswordHere', 'admin', 'local');

-- Inserir Imóveis de Venda
INSERT IGNORE INTO properties (title, description, referenceCode, propertyType, transactionType, price, bedrooms, bathrooms, area, address, city, neighborhood, imageUrl, status) VALUES 
('Mansão Lago Sul', 'Luxuosa mansão com 5 suítes, piscina e área de lazer completa', 'MANS-001', 'casa', 'venda', 2500000, 5, 4, 450, 'Lago Sul, Brasília - DF', 'Brasília', 'Lago Sul', 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800', 'ativo'),
('Penthouse Asa Norte', 'Apartamento de alto padrão com vista panorâmica de Brasília', 'PENT-001', 'cobertura', 'venda', 1800000, 4, 3, 320, 'Asa Norte, Brasília - DF', 'Brasília', 'Asa Norte', 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800', 'ativo'),
('Apartamento Águas Claras', 'Moderno apartamento com 3 quartos e garagem dupla', 'APAR-001', 'apartamento', 'venda', 850000, 3, 2, 120, 'Águas Claras, Brasília - DF', 'Brasília', 'Águas Claras', 'https://images.unsplash.com/photo-1545324418-cc1a9a6fded0?w=800', 'ativo');

-- Inserir Imóveis de Aluguel
INSERT IGNORE INTO properties (title, description, referenceCode, propertyType, transactionType, rentAmount, bedrooms, bathrooms, area, address, city, neighborhood, imageUrl, status) VALUES 
('Apartamento Águas Claras - Aluguel', 'Aconchegante apartamento com 2 quartos', 'ALUG-001', 'apartamento', 'locacao', 2500, 2, 1, 85, 'Águas Claras, Brasília - DF', 'Brasília', 'Águas Claras', 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800', 'ativo'),
('Apartamento Taguatinga - Aluguel', 'Espaçoso apartamento com 3 quartos', 'ALUG-002', 'apartamento', 'locacao', 1800, 3, 2, 110, 'Taguatinga, Brasília - DF', 'Brasília', 'Taguatinga', 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800', 'ativo'),
('Casa Sobradinho - Aluguel', 'Confortável casa com 4 quartos', 'ALUG-003', 'casa', 'locacao', 3200, 4, 2, 180, 'Sobradinho, Brasília - DF', 'Brasília', 'Sobradinho', 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800', 'ativo');

-- Inserir Leads
INSERT IGNORE INTO leads (name, email, phone, source, status, notes) VALUES 
('João Silva', 'joao@email.com', '(61) 98765-4321', 'website', 'novo', 'Interessado em imóveis de venda no Lago Sul'),
('Maria Santos', 'maria@email.com', '(61) 99876-5432', 'telefone', 'em_negociacao', 'Procurando apartamento para aluguel em Águas Claras'),
('Carlos Oliveira', 'carlos@email.com', '(61) 97654-3210', 'indicacao', 'qualificado', 'Investidor interessado em imóveis para aluguel'),
('Ana Costa', 'ana@email.com', '(61) 98765-4321', 'website', 'novo', 'Consultando sobre financiamento imobiliário'),
('Pedro Ferreira', 'pedro@email.com', '(61) 99876-5432', 'redes_sociais', 'em_negociacao', 'Interessado em penthouse na Asa Norte');

-- Inserir Blog Posts
INSERT IGNORE INTO blog_posts (title, slug, content, excerpt, author, featured, published, status) VALUES 
('Como Financiar um Imóvel em Brasília', 'como-financiar-imovel-brasilia', 'Guia completo sobre as melhores opções de financiamento imobiliário no Distrito Federal. Conheça as taxas dos principais bancos e como escolher a melhor opção para você.', 'Descubra as melhores formas de financiar seu imóvel em Brasília', 'Casa DF', 1, 1, 'published'),
('Dicas para Alugar um Imóvel com Segurança', 'dicas-alugar-imovel-seguranca', 'Saiba quais são os cuidados essenciais ao alugar um imóvel. Desde a análise de documentos até a assinatura do contrato, confira todas as dicas importantes.', 'Proteja-se ao alugar um imóvel seguindo estas dicas', 'Casa DF', 1, 1, 'published');
