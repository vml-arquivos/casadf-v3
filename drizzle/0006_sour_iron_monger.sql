CREATE TABLE `analytics_events` (
	`id` int AUTO_INCREMENT NOT NULL,
	`eventType` varchar(50) NOT NULL,
	`propertyId` int,
	`leadId` int,
	`userId` int,
	`source` varchar(100),
	`medium` varchar(100),
	`campaign` varchar(255),
	`url` varchar(500),
	`referrer` varchar(500),
	`userAgent` text,
	`ipAddress` varchar(45),
	`metadata` json,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `analytics_events_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `campaign_sources` (
	`id` int AUTO_INCREMENT NOT NULL,
	`name` varchar(255) NOT NULL,
	`source` varchar(100) NOT NULL,
	`medium` varchar(100),
	`campaignId` varchar(255),
	`budget` decimal(10,2),
	`clicks` int DEFAULT 0,
	`impressions` int DEFAULT 0,
	`conversions` int DEFAULT 0,
	`active` boolean DEFAULT true,
	`startDate` date,
	`endDate` date,
	`notes` text,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `campaign_sources_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `commissions` (
	`id` int AUTO_INCREMENT NOT NULL,
	`propertyId` int NOT NULL,
	`leadId` int NOT NULL,
	`ownerId` int,
	`salePrice` decimal(12,2) NOT NULL,
	`commissionRate` decimal(5,2) NOT NULL,
	`commissionAmount` decimal(12,2) NOT NULL,
	`splitWithAgent` boolean DEFAULT false,
	`agentName` varchar(255),
	`agentCommissionAmount` decimal(12,2),
	`status` varchar(50) DEFAULT 'pending',
	`paymentDate` date,
	`notes` text,
	`transactionId` int,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `commissions_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `reviews` (
	`id` int AUTO_INCREMENT NOT NULL,
	`clientName` varchar(255) NOT NULL,
	`clientRole` varchar(100),
	`clientPhoto` varchar(500),
	`rating` int NOT NULL,
	`title` varchar(255),
	`content` text NOT NULL,
	`propertyId` int,
	`leadId` int,
	`approved` boolean DEFAULT false,
	`featured` boolean DEFAULT false,
	`displayOrder` int DEFAULT 0,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `reviews_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `transactions` (
	`id` int AUTO_INCREMENT NOT NULL,
	`type` varchar(50) NOT NULL,
	`category` varchar(100),
	`amount` decimal(12,2) NOT NULL,
	`currency` varchar(3) DEFAULT 'BRL',
	`propertyId` int,
	`leadId` int,
	`ownerId` int,
	`description` text NOT NULL,
	`notes` text,
	`status` varchar(50) DEFAULT 'pending',
	`paymentMethod` varchar(50),
	`paymentDate` date,
	`dueDate` date,
	`receiptUrl` varchar(500),
	`invoiceNumber` varchar(100),
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `transactions_id` PRIMARY KEY(`id`)
);
