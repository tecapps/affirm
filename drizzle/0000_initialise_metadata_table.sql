-- Migration number: 0000 	 2026-02-07T16:01:40.087Z

CREATE TABLE IF NOT EXISTS `metadata` (
	`key` text PRIMARY KEY NOT NULL,
	`value` text NOT NULL
);

--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS `metadata_key_unique` ON `metadata` (`key`);
