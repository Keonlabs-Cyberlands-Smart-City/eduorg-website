CREATE TABLE `stories` (
	`id` int AUTO_INCREMENT NOT NULL,
	`category` enum('teacher','student','headteacher','parent','staff','other') NOT NULL,
	`authorName` varchar(255) NOT NULL,
	`school` varchar(255) NOT NULL,
	`title` varchar(255) NOT NULL,
	`content` text NOT NULL,
	`imageUrl` varchar(512),
	`videoUrl` varchar(512),
	`audioUrl` varchar(512),
	`status` enum('pending','approved','rejected') DEFAULT 'pending',
	`featured` enum('yes','no') DEFAULT 'no',
	`views` int DEFAULT 0,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `stories_id` PRIMARY KEY(`id`)
);
