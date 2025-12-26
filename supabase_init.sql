/**
 * CASADF V1.0.0 - SUPABASE INITIALIZATION SCRIPT
 * 
 * Este script cria toda a estrutura do banco de dados PostgreSQL
 * para o sistema Imobiliária SaaS (CasaDF).
 * 
 * INSTRUÇÕES:
 * 1. Acesse seu projeto Supabase
 * 2. Vá em "SQL Editor"
 * 3. Cole este script completo
 * 4. Clique em "Run"
 * 5. Aguarde a execução (deve levar ~30 segundos)
 * 
 * Após a execução, o banco estará pronto com:
 * - Schema completo
 * - Usuário admin
 * - Dados de demonstração
 */

-- ============================================
-- EXTENSÕES POSTGRESQL
-- ============================================

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ============================================
-- ENUMS
-- ============================================

CREATE TYPE role AS ENUM ('admin', 'owner', 'tenant', 'client');
CREATE TYPE property_type AS ENUM ('casa', 'apartamento', 'cobertura', 'terreno', 'comercial', 'rural');
CREATE TYPE transaction_type AS ENUM ('venda', 'locacao', 'ambos');
CREATE TYPE lead_status AS ENUM ('novo', 'contato_inicial', 'qualificado', 'visita_agendada', 'visita_realizada', 'proposta', 'negociacao', 'fechado_ganho', 'fechado_perdido', 'sem_interesse');
CREATE TYPE transaction_type_finance AS ENUM ('revenue', 'expense', 'transfer', 'commission');
CREATE TYPE transaction_status AS ENUM ('pending', 'paid', 'overdue', 'cancelled');
CREATE TYPE contract_status AS ENUM ('ACTIVE', 'INACTIVE', 'TERMINATED', 'EXPIRED');

-- ============================================
-- TABELA: USERS
-- ============================================

CREATE TABLE IF NOT EXISTS users (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(320) NOT NULL UNIQUE,
  password_hash VARCHAR(255),
  role role DEFAULT 'client' NOT NULL,
  phone VARCHAR(20),
  whatsapp VARCHAR(20),
  avatar VARCHAR(500),
  login_method VARCHAR(50) DEFAULT 'local',
  open_id VARCHAR(255) UNIQUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
  last_signed_in TIMESTAMP WITH TIME ZONE
);

CREATE INDEX IF NOT EXISTS users_email_idx ON users(email);
CREATE INDEX IF NOT EXISTS users_role_idx ON users(role);

-- ============================================
-- TABELA: PROPERTIES
-- ============================================

CREATE TABLE IF NOT EXISTS properties (
  id SERIAL PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  property_type property_type NOT NULL,
  transaction_type transaction_type NOT NULL,
  
  -- Preços
  sale_price DECIMAL(15, 2),
  rent_price DECIMAL(10, 2),
  
  -- Localização
  address VARCHAR(500) NOT NULL,
  neighborhood VARCHAR(255),
  city VARCHAR(255) NOT NULL,
  state VARCHAR(2) NOT NULL,
  zip_code VARCHAR(10),
  latitude DECIMAL(10, 8),
  longitude DECIMAL(11, 8),
  
  -- Características
  bedrooms INTEGER,
  bathrooms INTEGER,
  parking_spaces INTEGER,
  total_area DECIMAL(10, 2),
  built_area DECIMAL(10, 2),
  
  -- Mídia
  main_image VARCHAR(500),
  images JSONB,
  
  -- Status
  status VARCHAR(50) DEFAULT 'disponivel',
  featured BOOLEAN DEFAULT FALSE,
  published BOOLEAN DEFAULT TRUE,
  
  -- Relacionamentos
  owner_id INTEGER REFERENCES users(id) ON DELETE SET NULL,
  created_by INTEGER REFERENCES users(id) ON DELETE SET NULL,
  
  -- Timestamps
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
);

CREATE INDEX IF NOT EXISTS properties_owner_id_idx ON properties(owner_id);
CREATE INDEX IF NOT EXISTS properties_city_idx ON properties(city);
CREATE INDEX IF NOT EXISTS properties_status_idx ON properties(status);
CREATE INDEX IF NOT EXISTS properties_type_idx ON properties(property_type);

-- ============================================
-- TABELA: LEADS
-- ============================================

CREATE TABLE IF NOT EXISTS leads (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(320) UNIQUE,
  phone VARCHAR(20),
  whatsapp VARCHAR(20),
  
  -- Status e qualificação
  status lead_status DEFAULT 'novo' NOT NULL,
  source VARCHAR(50),
  score INTEGER DEFAULT 0,
  priority VARCHAR(20) DEFAULT 'media',
  
  -- Preferências
  interested_property_type VARCHAR(50),
  transaction_type VARCHAR(50),
  budget_min DECIMAL(15, 2),
  budget_max DECIMAL(15, 2),
  preferred_neighborhoods TEXT,
  preferred_property_types TEXT,
  
  -- Relacionamentos
  interested_property_id INTEGER REFERENCES properties(id) ON DELETE SET NULL,
  assigned_to INTEGER REFERENCES users(id) ON DELETE SET NULL,
  
  -- Notas e tags
  notes TEXT,
  tags JSONB,
  
  -- Timestamps
  last_contacted_at TIMESTAMP WITH TIME ZONE,
  converted_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
);

CREATE INDEX IF NOT EXISTS leads_email_idx ON leads(email);
CREATE INDEX IF NOT EXISTS leads_status_idx ON leads(status);
CREATE INDEX IF NOT EXISTS leads_source_idx ON leads(source);
CREATE INDEX IF NOT EXISTS leads_assigned_to_idx ON leads(assigned_to);

-- ============================================
-- TABELA: LEAD_INSIGHTS (Memória de IA)
-- ============================================

CREATE TABLE IF NOT EXISTS lead_insights (
  id SERIAL PRIMARY KEY,
  lead_id INTEGER NOT NULL REFERENCES leads(id) ON DELETE CASCADE,
  session_id VARCHAR(255),
  
  -- Conteúdo da conversa
  content TEXT,
  sender VARCHAR(50),
  
  -- Análise de IA
  sentiment_score INTEGER,
  ai_summary TEXT,
  recommended_action TEXT,
  
  -- Metadata
  metadata JSONB,
  
  -- Timestamps
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
);

CREATE INDEX IF NOT EXISTS lead_insights_lead_id_idx ON lead_insights(lead_id);
CREATE INDEX IF NOT EXISTS lead_insights_session_id_idx ON lead_insights(session_id);

-- ============================================
-- TABELA: CONTRACTS
-- ============================================

CREATE TABLE IF NOT EXISTS contracts (
  id SERIAL PRIMARY KEY,
  
  -- Relacionamentos
  property_id INTEGER NOT NULL REFERENCES properties(id) ON DELETE CASCADE,
  tenant_id INTEGER NOT NULL REFERENCES users(id) ON DELETE RESTRICT,
  owner_id INTEGER NOT NULL REFERENCES users(id) ON DELETE RESTRICT,
  
  -- Valores
  rent_amount DECIMAL(10, 2) NOT NULL,
  admin_fee_rate DECIMAL(5, 2) DEFAULT 10.00,
  admin_fee_amount DECIMAL(10, 2),
  security_deposit DECIMAL(10, 2),
  
  -- Datas
  start_date TIMESTAMP WITH TIME ZONE NOT NULL,
  end_date TIMESTAMP WITH TIME ZONE,
  payment_day INTEGER DEFAULT 5,
  
  -- Status
  status contract_status DEFAULT 'ACTIVE' NOT NULL,
  
  -- Documentos
  document_url VARCHAR(500),
  
  -- Timestamps
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
);

CREATE INDEX IF NOT EXISTS contracts_property_id_idx ON contracts(property_id);
CREATE INDEX IF NOT EXISTS contracts_tenant_id_idx ON contracts(tenant_id);
CREATE INDEX IF NOT EXISTS contracts_owner_id_idx ON contracts(owner_id);
CREATE INDEX IF NOT EXISTS contracts_status_idx ON contracts(status);

-- ============================================
-- TABELA: FINANCIAL_TRANSACTIONS
-- ============================================

CREATE TABLE IF NOT EXISTS financial_transactions (
  id SERIAL PRIMARY KEY,
  
  -- Relacionamento
  contract_id INTEGER REFERENCES contracts(id) ON DELETE SET NULL,
  property_id INTEGER REFERENCES properties(id) ON DELETE SET NULL,
  
  -- Tipo e categoria
  type transaction_type_finance NOT NULL,
  category VARCHAR(100) NOT NULL,
  
  -- Valores
  amount DECIMAL(15, 2) NOT NULL,
  currency VARCHAR(3) DEFAULT 'BRL',
  
  -- Descrição
  description TEXT,
  
  -- Status
  status transaction_status DEFAULT 'pending' NOT NULL,
  
  -- Datas
  due_date TIMESTAMP WITH TIME ZONE NOT NULL,
  payment_date TIMESTAMP WITH TIME ZONE,
  
  -- Referência
  reference_number VARCHAR(100),
  
  -- Timestamps
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
);

CREATE INDEX IF NOT EXISTS financial_transactions_contract_id_idx ON financial_transactions(contract_id);
CREATE INDEX IF NOT EXISTS financial_transactions_property_id_idx ON financial_transactions(property_id);
CREATE INDEX IF NOT EXISTS financial_transactions_type_idx ON financial_transactions(type);
CREATE INDEX IF NOT EXISTS financial_transactions_status_idx ON financial_transactions(status);
CREATE INDEX IF NOT EXISTS financial_transactions_due_date_idx ON financial_transactions(due_date);

-- ============================================
-- TABELA: BLOG_POSTS
-- ============================================

CREATE TABLE IF NOT EXISTS blog_posts (
  id SERIAL PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  slug VARCHAR(255) NOT NULL UNIQUE,
  content TEXT NOT NULL,
  excerpt TEXT,
  author VARCHAR(255),
  
  -- SEO
  meta_description VARCHAR(160),
  meta_keywords VARCHAR(255),
  
  -- Status
  status VARCHAR(50) DEFAULT 'draft',
  featured BOOLEAN DEFAULT FALSE,
  published BOOLEAN DEFAULT FALSE,
  
  -- Timestamps
  published_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
);

CREATE UNIQUE INDEX IF NOT EXISTS blog_posts_slug_idx ON blog_posts(slug);
CREATE INDEX IF NOT EXISTS blog_posts_status_idx ON blog_posts(status);

-- ============================================
-- TABELA: WEBHOOK_LOGS
-- ============================================

CREATE TABLE IF NOT EXISTS webhook_logs (
  id SERIAL PRIMARY KEY,
  source VARCHAR(100) NOT NULL,
  event VARCHAR(100) NOT NULL,
  payload JSONB,
  response JSONB,
  status VARCHAR(50) NOT NULL,
  error_message TEXT,
  
  -- Timestamps
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
);

CREATE INDEX IF NOT EXISTS webhook_logs_source_idx ON webhook_logs(source);
CREATE INDEX IF NOT EXISTS webhook_logs_event_idx ON webhook_logs(event);
CREATE INDEX IF NOT EXISTS webhook_logs_status_idx ON webhook_logs(status);

-- ============================================
-- DADOS INICIAIS
-- ============================================

-- Inserir usuário Admin
INSERT INTO users (name, email, password_hash, role, login_method, created_at, updated_at, last_signed_in)
VALUES (
  'Administrador CasaDF',
  'admin@casadf.com.br',
  -- Hash bcrypt de "admin123" (usar bcrypt para produção)
  '$2b$10$YourHashedPasswordHere',
  'admin',
  'local',
  NOW(),
  NOW(),
  NOW()
) ON CONFLICT (email) DO NOTHING;

-- Inserir proprietários de teste
INSERT INTO users (name, email, password_hash, role, phone, whatsapp, login_method, created_at, updated_at)
VALUES
  ('Proprietário 1', 'proprietario1@casadf.com.br', '$2b$10$YourHashedPasswordHere', 'owner', '(61) 98765-4321', '61987654321', 'local', NOW(), NOW()),
  ('Proprietário 2', 'proprietario2@casadf.com.br', '$2b$10$YourHashedPasswordHere', 'owner', '(61) 99876-5432', '61998765432', 'local', NOW(), NOW()),
  ('Proprietário 3', 'proprietario3@casadf.com.br', '$2b$10$YourHashedPasswordHere', 'owner', '(61) 97654-3210', '61976543210', 'local', NOW(), NOW())
ON CONFLICT (email) DO NOTHING;

-- Inserir imóveis de exemplo
INSERT INTO properties (
  title, description, property_type, transaction_type,
  sale_price, rent_price, address, neighborhood, city, state,
  bedrooms, bathrooms, total_area, main_image, status, featured, published,
  owner_id, created_by, created_at, updated_at
)
SELECT
  'Mansão Lago Sul - Venda',
  'Luxuosa mansão com 5 suítes, piscina e área de lazer completa',
  'casa'::property_type,
  'venda'::transaction_type,
  2500000.00,
  NULL,
  'Lago Sul, Brasília - DF',
  'Lago Sul',
  'Brasília',
  'DF',
  5, 4, 450,
  'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800',
  'disponivel',
  TRUE,
  TRUE,
  (SELECT id FROM users WHERE email = 'proprietario1@casadf.com.br' LIMIT 1),
  (SELECT id FROM users WHERE email = 'admin@casadf.com.br' LIMIT 1),
  NOW(),
  NOW()
WHERE NOT EXISTS (SELECT 1 FROM properties WHERE title = 'Mansão Lago Sul - Venda')

UNION ALL

SELECT
  'Penthouse Asa Norte - Venda',
  'Apartamento de alto padrão com vista panorâmica de Brasília',
  'cobertura'::property_type,
  'venda'::transaction_type,
  1800000.00,
  NULL,
  'Asa Norte, Brasília - DF',
  'Asa Norte',
  'Brasília',
  'DF',
  4, 3, 320,
  'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800',
  'disponivel',
  TRUE,
  TRUE,
  (SELECT id FROM users WHERE email = 'proprietario2@casadf.com.br' LIMIT 1),
  (SELECT id FROM users WHERE email = 'admin@casadf.com.br' LIMIT 1),
  NOW(),
  NOW()
WHERE NOT EXISTS (SELECT 1 FROM properties WHERE title = 'Penthouse Asa Norte - Venda')

UNION ALL

SELECT
  'Apartamento Águas Claras - Aluguel',
  'Aconchegante apartamento com 2 quartos',
  'apartamento'::property_type,
  'locacao'::transaction_type,
  NULL,
  2500.00,
  'Águas Claras, Brasília - DF',
  'Águas Claras',
  'Brasília',
  'DF',
  2, 1, 85,
  'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800',
  'alugado',
  FALSE,
  TRUE,
  (SELECT id FROM users WHERE email = 'proprietario3@casadf.com.br' LIMIT 1),
  (SELECT id FROM users WHERE email = 'admin@casadf.com.br' LIMIT 1),
  NOW(),
  NOW()
WHERE NOT EXISTS (SELECT 1 FROM properties WHERE title = 'Apartamento Águas Claras - Aluguel');

-- Inserir leads de exemplo
INSERT INTO leads (name, email, phone, whatsapp, status, source, score, priority, budget_min, budget_max, created_at, updated_at)
VALUES
  ('João Silva', 'joao@email.com', '(61) 98765-4321', '61987654321', 'novo'::lead_status, 'website', 0, 'media', 500000.00, 1000000.00, NOW(), NOW()),
  ('Maria Santos', 'maria@email.com', '(61) 99876-5432', '61998765432', 'qualificado'::lead_status, 'whatsapp', 75, 'alta', 200000.00, 400000.00, NOW(), NOW()),
  ('Carlos Oliveira', 'carlos@email.com', '(61) 97654-3210', '61976543210', 'negociacao'::lead_status, 'indicacao', 85, 'urgente', 1000000.00, 2000000.00, NOW(), NOW())
ON CONFLICT (email) DO NOTHING;

-- Inserir posts de blog
INSERT INTO blog_posts (title, slug, content, excerpt, author, status, featured, published, published_at, created_at, updated_at)
VALUES
  (
    'Como Financiar um Imóvel em Brasília',
    'como-financiar-imovel-brasilia',
    'Guia completo sobre as melhores opções de financiamento imobiliário no Distrito Federal. Conheça as taxas dos principais bancos e como escolher a melhor opção para você.',
    'Descubra as melhores formas de financiar seu imóvel em Brasília',
    'Casa DF',
    'published'::text,
    TRUE,
    TRUE,
    NOW(),
    NOW(),
    NOW()
  ),
  (
    'Dicas para Alugar um Imóvel com Segurança',
    'dicas-alugar-imovel-seguranca',
    'Saiba quais são os cuidados essenciais ao alugar um imóvel. Desde a análise de documentos até a assinatura do contrato, confira todas as dicas importantes.',
    'Proteja-se ao alugar um imóvel seguindo estas dicas',
    'Casa DF',
    'published'::text,
    TRUE,
    TRUE,
    NOW(),
    NOW(),
    NOW()
  )
ON CONFLICT (slug) DO NOTHING;

-- ============================================
-- CONFIRMAÇÃO
-- ============================================

-- Verificar dados inseridos
SELECT 'SCHEMA CRIADO COM SUCESSO!' as status;
SELECT COUNT(*) as total_users FROM users;
SELECT COUNT(*) as total_properties FROM properties;
SELECT COUNT(*) as total_leads FROM leads;
SELECT COUNT(*) as total_blog_posts FROM blog_posts;
