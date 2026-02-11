CREATE TABLE "boardGames" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"slug" text NOT NULL,
	"bbg_id" integer,
	"min_players" integer NOT NULL,
	"max_players" integer NOT NULL,
	"bgg_best_players" integer NOT NULL,
	"played" boolean NOT NULL,
	"created_at" timestamp,
	"updated_at" timestamp,
	CONSTRAINT "boardGames_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
CREATE TABLE "boardGamesExpansions" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"slug" text NOT NULL,
	"board_game_id" integer NOT NULL,
	"bbgid" integer,
	"min_players" integer NOT NULL,
	"max_players" integer NOT NULL,
	"bbg_best_players" integer NOT NULL,
	"played" boolean NOT NULL,
	"created_at" timestamp,
	"updated_at" timestamp,
	CONSTRAINT "boardGamesExpansions_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
CREATE TABLE "gameSession" (
	"id" serial PRIMARY KEY NOT NULL,
	"board_game_id" integer NOT NULL,
	"expansion_id" integer,
	"winner_player_id" integer,
	"points" integer,
	"played_date" timestamp NOT NULL,
	"created_at" timestamp NOT NULL,
	"updated_at" timestamp NOT NULL
);
--> statement-breakpoint
CREATE TABLE "gameSessionPlayers" (
	"id" serial PRIMARY KEY NOT NULL,
	"game_session_id" integer NOT NULL,
	"player_id" integer NOT NULL,
	"player_points" integer,
	"created_at" timestamp,
	"updated_at" timestamp
);
--> statement-breakpoint
CREATE TABLE "player" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"created_at" timestamp NOT NULL,
	"updated_at" timestamp NOT NULL
);
--> statement-breakpoint
ALTER TABLE "boardGamesExpansions" ADD CONSTRAINT "boardGamesExpansions_board_game_id_boardGames_id_fk" FOREIGN KEY ("board_game_id") REFERENCES "public"."boardGames"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "gameSession" ADD CONSTRAINT "gameSession_board_game_id_boardGames_id_fk" FOREIGN KEY ("board_game_id") REFERENCES "public"."boardGames"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "gameSession" ADD CONSTRAINT "gameSession_expansion_id_boardGamesExpansions_id_fk" FOREIGN KEY ("expansion_id") REFERENCES "public"."boardGamesExpansions"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "gameSession" ADD CONSTRAINT "gameSession_winner_player_id_player_id_fk" FOREIGN KEY ("winner_player_id") REFERENCES "public"."player"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "gameSessionPlayers" ADD CONSTRAINT "gameSessionPlayers_game_session_id_gameSession_id_fk" FOREIGN KEY ("game_session_id") REFERENCES "public"."gameSession"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "gameSessionPlayers" ADD CONSTRAINT "gameSessionPlayers_player_id_player_id_fk" FOREIGN KEY ("player_id") REFERENCES "public"."player"("id") ON DELETE cascade ON UPDATE no action;