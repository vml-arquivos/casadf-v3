-- Migration: Add local authentication support
-- Date: 2025-12-10
-- Description: Add password field, make openId nullable, add email unique constraint

-- Modificar tabela users para suportar autenticação local
ALTER TABLE `users` 
  MODIFY COLUMN `openId` varchar(64) NULL,
  MODIFY COLUMN `name` text NOT NULL,
  MODIFY COLUMN `email` varchar(320) NOT NULL,
  ADD COLUMN `password` varchar(255) NULL COMMENT 'Hash da senha (scrypt)',
  MODIFY COLUMN `loginMethod` varchar(64) DEFAULT 'local',
  ADD UNIQUE INDEX `email_unique` (`email`);

-- Remover constraint UNIQUE do openId se existir como NOT NULL
-- (já foi modificado para NULL acima, mas garantir que não há conflito)
ALTER TABLE `users` DROP INDEX IF EXISTS `openId_unique`;
ALTER TABLE `users` ADD UNIQUE INDEX `openId_unique` (`openId`);

-- Comentários para documentação
ALTER TABLE `users` 
  MODIFY COLUMN `password` varchar(255) NULL COMMENT 'Hash da senha usando scrypt (salt.hash)',
  MODIFY COLUMN `openId` varchar(64) NULL COMMENT 'Nullable para compatibilidade com auth local',
  MODIFY COLUMN `loginMethod` varchar(64) DEFAULT 'local' COMMENT 'Método de login: local, oauth, etc';
