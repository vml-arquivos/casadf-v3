ALTER TABLE `leads` ADD `clientType` enum('comprador','locatario','proprietario') DEFAULT 'comprador' NOT NULL;--> statement-breakpoint
ALTER TABLE `leads` ADD `qualification` enum('quente','morno','frio','nao_qualificado') DEFAULT 'nao_qualificado' NOT NULL;--> statement-breakpoint
ALTER TABLE `leads` ADD `urgencyLevel` enum('baixa','media','alta','urgente') DEFAULT 'media';--> statement-breakpoint
ALTER TABLE `leads` ADD `transactionInterest` enum('venda','locacao','ambos') DEFAULT 'venda';