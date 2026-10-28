CREATE TABLE `login_attempts` (
	`email` text PRIMARY KEY NOT NULL,
	`attempts` integer NOT NULL,
	`window_started_at` integer NOT NULL
);
