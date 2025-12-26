-- Migration: Add site customization fields (Site Builder / CMS)
-- Date: 2025-12-10
-- Description: Add theme style, primary color, hero section and about section fields

-- Adicionar campos de customização visual na tabela site_settings
ALTER TABLE `site_settings` 
  ADD COLUMN `themeStyle` enum('modern','classic') DEFAULT 'modern' COMMENT 'Estilo do tema (modern ou classic)',
  ADD COLUMN `primaryColor` varchar(7) DEFAULT '#0f172a' COMMENT 'Cor primária em formato hex (#RRGGBB)',
  ADD COLUMN `heroTitle` varchar(255) NULL COMMENT 'Título da seção hero',
  ADD COLUMN `heroSubtitle` text NULL COMMENT 'Subtítulo da seção hero',
  ADD COLUMN `heroBackgroundImage` varchar(500) NULL COMMENT 'URL da imagem de fundo da seção hero',
  ADD COLUMN `aboutSectionTitle` varchar(255) NULL COMMENT 'Título da seção sobre',
  ADD COLUMN `aboutSectionContent` text NULL COMMENT 'Conteúdo da seção sobre',
  ADD COLUMN `aboutSectionImage` varchar(500) NULL COMMENT 'URL da imagem da seção sobre';

-- Comentários para documentação
ALTER TABLE `site_settings` 
  MODIFY COLUMN `themeStyle` enum('modern','classic') DEFAULT 'modern' COMMENT 'Estilo visual: modern (full-width) ou classic (centralizado)',
  MODIFY COLUMN `primaryColor` varchar(7) DEFAULT '#0f172a' COMMENT 'Cor primária da marca (hex color)';
