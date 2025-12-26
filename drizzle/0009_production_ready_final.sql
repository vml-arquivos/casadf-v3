-- ============================================
-- MIGRATION: PRODUCTION READY - FINAL
-- Date: 2025-12-10
-- Description: Consolidação de autenticação local + site builder CMS
-- ============================================

-- ============================================
-- PARTE 1: AUTENTICAÇÃO LOCAL
-- ============================================

-- Adicionar campo password na tabela users (se não existir)
ALTER TABLE `users` 
  ADD COLUMN IF NOT EXISTS `password` varchar(255) NULL COMMENT 'Hash da senha (scrypt/bcrypt) para autenticação local';

-- Tornar openId nullable (permitir login sem OAuth)
ALTER TABLE `users` 
  MODIFY COLUMN `openId` varchar(255) NULL COMMENT 'ID do OAuth (nullable para suportar auth local)';

-- Garantir que email seja único e obrigatório
ALTER TABLE `users` 
  MODIFY COLUMN `email` varchar(320) NOT NULL COMMENT 'Email do usuário (obrigatório)',
  ADD UNIQUE KEY IF NOT EXISTS `idx_users_email` (`email`);

-- Adicionar índice para performance em login
CREATE INDEX IF NOT EXISTS `idx_users_email_password` ON `users` (`email`, `password`);

-- ============================================
-- PARTE 2: SITE BUILDER / CMS
-- ============================================

-- Adicionar campos de customização visual na tabela site_settings (se não existirem)
ALTER TABLE `site_settings` 
  ADD COLUMN IF NOT EXISTS `themeStyle` enum('modern','classic') DEFAULT 'modern' COMMENT 'Estilo visual: modern (full-width) ou classic (centralizado)',
  ADD COLUMN IF NOT EXISTS `primaryColor` varchar(7) DEFAULT '#0f172a' COMMENT 'Cor primária da marca (hex color)',
  ADD COLUMN IF NOT EXISTS `heroTitle` varchar(255) NULL COMMENT 'Título da seção hero/banner principal',
  ADD COLUMN IF NOT EXISTS `heroSubtitle` text NULL COMMENT 'Subtítulo da seção hero',
  ADD COLUMN IF NOT EXISTS `heroBackgroundImage` varchar(500) NULL COMMENT 'URL da imagem de fundo da seção hero',
  ADD COLUMN IF NOT EXISTS `aboutSectionTitle` varchar(255) NULL COMMENT 'Título da seção sobre/quem somos',
  ADD COLUMN IF NOT EXISTS `aboutSectionContent` text NULL COMMENT 'Conteúdo da seção sobre',
  ADD COLUMN IF NOT EXISTS `aboutSectionImage` varchar(500) NULL COMMENT 'URL da imagem da seção sobre';

-- ============================================
-- DADOS PADRÃO (SEED)
-- ============================================

-- Inserir configurações padrão se não existirem
INSERT IGNORE INTO `site_settings` (
  `id`,
  `companyName`,
  `siteTitle`,
  `siteDescription`,
  `themeStyle`,
  `primaryColor`,
  `heroTitle`,
  `heroSubtitle`,
  `aboutSectionTitle`,
  `aboutSectionContent`
) VALUES (
  1,
  'Casa DF Imóveis',
  'Casa DF - Imóveis em Brasília',
  'Encontre o imóvel ideal em Brasília com a Casa DF. Atendimento personalizado e imóveis de qualidade.',
  'modern',
  '#0f172a',
  'Encontre Seu Imóvel em Brasília',
  'A Casa DF Imóveis oferece as melhores opções de imóveis em Brasília e região. Encontre seu lar ideal com nosso atendimento especializado.',
  'Casa DF Imóveis',
  'Sua imobiliária de confiança em Brasília. Especializada em imóveis residenciais e comerciais com atendimento personalizado e profissional.\n\nA Casa DF Imóveis oferece soluções completas para compra, venda e locação de imóveis em Brasília e região. Nossa equipe está pronta para te ajudar a encontrar o imóvel ideal, com transparência, agilidade e segurança em todas as etapas.'
);

-- ============================================
-- COMENTÁRIOS E DOCUMENTAÇÃO
-- ============================================

-- Atualizar comentários das colunas para documentação
ALTER TABLE `users` 
  MODIFY COLUMN `password` varchar(255) NULL COMMENT 'Hash da senha (scrypt) - NULL para usuários OAuth',
  MODIFY COLUMN `loginMethod` varchar(64) DEFAULT 'local' COMMENT 'Método de login: local, google, facebook, etc',
  MODIFY COLUMN `role` enum('user','admin') DEFAULT 'user' NOT NULL COMMENT 'Papel do usuário no sistema';

ALTER TABLE `site_settings`
  MODIFY COLUMN `themeStyle` enum('modern','classic') DEFAULT 'modern' COMMENT 'Estilo do tema: modern (full-width, minimalista) ou classic (centralizado, tradicional)',
  MODIFY COLUMN `primaryColor` varchar(7) DEFAULT '#0f172a' COMMENT 'Cor primária em formato hex (#RRGGBB) aplicada globalmente';

-- ============================================
-- FIM DA MIGRATION
-- ============================================
