CREATE TABLE `drafts` (
	`id` text PRIMARY KEY NOT NULL,
	`owner` text NOT NULL,
	`title` text NOT NULL,
	`content` text NOT NULL,
	`source_ids` text NOT NULL,
	`created_at` text NOT NULL,
	`updated_at` text NOT NULL
);
--> statement-breakpoint
CREATE INDEX `idx_drafts_owner_updated` ON `drafts` (`owner`,`updated_at`);--> statement-breakpoint
CREATE TABLE `images` (
	`id` text PRIMARY KEY NOT NULL,
	`note_id` text NOT NULL,
	`owner` text NOT NULL,
	`mime` text NOT NULL,
	`name` text NOT NULL,
	FOREIGN KEY (`note_id`) REFERENCES `notes`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE INDEX `idx_images_owner_note` ON `images` (`owner`,`note_id`);--> statement-breakpoint
CREATE TABLE `notes` (
	`id` text PRIMARY KEY NOT NULL,
	`owner` text NOT NULL,
	`category` text NOT NULL,
	`content` text NOT NULL,
	`starred` integer DEFAULT 0 NOT NULL,
	`created_at` text NOT NULL,
	`updated_at` text NOT NULL
);
--> statement-breakpoint
CREATE INDEX `idx_notes_owner_created` ON `notes` (`owner`,`created_at`);