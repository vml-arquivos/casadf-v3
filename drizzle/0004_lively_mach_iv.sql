CREATE TABLE `ai_context_status` (
	`id` int AUTO_INCREMENT NOT NULL,
	`sessionId` varchar(255) NOT NULL,
	`phone` varchar(20) NOT NULL,
	`message` text NOT NULL,
	`role` enum('user','assistant','system') NOT NULL,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `ai_context_status_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `client_interests` (
	`id` int AUTO_INCREMENT NOT NULL,
	`clientId` int NOT NULL,
	`propertyType` varchar(100),
	`interestType` enum('venda','locacao','ambos'),
	`budgetMin` int,
	`budgetMax` int,
	`preferredNeighborhoods` text,
	`notes` text,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `client_interests_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `message_buffer` (
	`id` int AUTO_INCREMENT NOT NULL,
	`phone` varchar(20) NOT NULL,
	`messageId` varchar(255) NOT NULL,
	`content` text,
	`type` enum('incoming','outgoing') NOT NULL,
	`timestamp` timestamp NOT NULL DEFAULT (now()),
	`processed` int NOT NULL DEFAULT 0,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `message_buffer_id` PRIMARY KEY(`id`),
	CONSTRAINT `message_buffer_messageId_unique` UNIQUE(`messageId`)
);
--> statement-breakpoint
CREATE TABLE `webhook_logs` (
	`id` int AUTO_INCREMENT NOT NULL,
	`source` varchar(50) NOT NULL,
	`event` varchar(100) NOT NULL,
	`payload` text,
	`response` text,
	`status` enum('success','error','pending') NOT NULL,
	`errorMessage` text,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `webhook_logs_id` PRIMARY KEY(`id`)
);
