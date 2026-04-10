CREATE TABLE `testimonials` (
	`id` int AUTO_INCREMENT NOT NULL,
	`studentName` varchar(255) NOT NULL,
	`studentRole` varchar(255) NOT NULL,
	`quote` text NOT NULL,
	`story` text,
	`photoUrl` varchar(512),
	`program` varchar(255),
	`impact` text,
	`rating` int DEFAULT 5,
	`featured` enum('yes','no') DEFAULT 'no',
	`status` enum('active','inactive') DEFAULT 'active',
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `testimonials_id` PRIMARY KEY(`id`)
);
