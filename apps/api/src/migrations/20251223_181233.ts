import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_conversations_participants_role" AS ENUM('user', 'provider');
  CREATE TYPE "public"."enum_conversations_status" AS ENUM('active', 'archived', 'closed');
  CREATE TYPE "public"."enum_messages_message_type" AS ENUM('text', 'system', 'image', 'file');
  CREATE TABLE "conversations_participants" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"user_id" integer NOT NULL,
  	"role" "enum_conversations_participants_role" NOT NULL,
  	"last_read_at" timestamp(3) with time zone,
  	"muted" boolean DEFAULT false
  );
  
  CREATE TABLE "conversations" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"booking_id" integer NOT NULL,
  	"property_id" integer NOT NULL,
  	"last_message_content" varchar,
  	"last_message_sender_id" integer,
  	"last_message_sent_at" timestamp(3) with time zone,
  	"last_message_at" timestamp(3) with time zone,
  	"message_count" numeric DEFAULT 0,
  	"status" "enum_conversations_status" DEFAULT 'active',
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "messages_attachments" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"file_id" integer,
  	"file_name" varchar
  );
  
  CREATE TABLE "messages_read_by" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"user_id" integer,
  	"read_at" timestamp(3) with time zone
  );
  
  CREATE TABLE "messages" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"conversation_id" integer NOT NULL,
  	"sender_id" integer NOT NULL,
  	"content" varchar NOT NULL,
  	"message_type" "enum_messages_message_type" DEFAULT 'text',
  	"is_edited" boolean DEFAULT false,
  	"edited_at" timestamp(3) with time zone,
  	"is_deleted" boolean DEFAULT false,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "conversations_id" integer;
  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "messages_id" integer;
  ALTER TABLE "conversations_participants" ADD CONSTRAINT "conversations_participants_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "conversations_participants" ADD CONSTRAINT "conversations_participants_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."conversations"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "conversations" ADD CONSTRAINT "conversations_booking_id_bookings_id_fk" FOREIGN KEY ("booking_id") REFERENCES "public"."bookings"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "conversations" ADD CONSTRAINT "conversations_property_id_properties_id_fk" FOREIGN KEY ("property_id") REFERENCES "public"."properties"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "conversations" ADD CONSTRAINT "conversations_last_message_sender_id_users_id_fk" FOREIGN KEY ("last_message_sender_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "messages_attachments" ADD CONSTRAINT "messages_attachments_file_id_media_id_fk" FOREIGN KEY ("file_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "messages_attachments" ADD CONSTRAINT "messages_attachments_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."messages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "messages_read_by" ADD CONSTRAINT "messages_read_by_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "messages_read_by" ADD CONSTRAINT "messages_read_by_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."messages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "messages" ADD CONSTRAINT "messages_conversation_id_conversations_id_fk" FOREIGN KEY ("conversation_id") REFERENCES "public"."conversations"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "messages" ADD CONSTRAINT "messages_sender_id_users_id_fk" FOREIGN KEY ("sender_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;
  CREATE INDEX "conversations_participants_order_idx" ON "conversations_participants" USING btree ("_order");
  CREATE INDEX "conversations_participants_parent_id_idx" ON "conversations_participants" USING btree ("_parent_id");
  CREATE INDEX "conversations_participants_user_idx" ON "conversations_participants" USING btree ("user_id");
  CREATE UNIQUE INDEX "conversations_booking_idx" ON "conversations" USING btree ("booking_id");
  CREATE INDEX "conversations_property_idx" ON "conversations" USING btree ("property_id");
  CREATE INDEX "conversations_last_message_last_message_sender_idx" ON "conversations" USING btree ("last_message_sender_id");
  CREATE INDEX "conversations_updated_at_idx" ON "conversations" USING btree ("updated_at");
  CREATE INDEX "conversations_created_at_idx" ON "conversations" USING btree ("created_at");
  CREATE INDEX "messages_attachments_order_idx" ON "messages_attachments" USING btree ("_order");
  CREATE INDEX "messages_attachments_parent_id_idx" ON "messages_attachments" USING btree ("_parent_id");
  CREATE INDEX "messages_attachments_file_idx" ON "messages_attachments" USING btree ("file_id");
  CREATE INDEX "messages_read_by_order_idx" ON "messages_read_by" USING btree ("_order");
  CREATE INDEX "messages_read_by_parent_id_idx" ON "messages_read_by" USING btree ("_parent_id");
  CREATE INDEX "messages_read_by_user_idx" ON "messages_read_by" USING btree ("user_id");
  CREATE INDEX "messages_conversation_idx" ON "messages" USING btree ("conversation_id");
  CREATE INDEX "messages_sender_idx" ON "messages" USING btree ("sender_id");
  CREATE INDEX "messages_updated_at_idx" ON "messages" USING btree ("updated_at");
  CREATE INDEX "messages_created_at_idx" ON "messages" USING btree ("created_at");
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_conversations_fk" FOREIGN KEY ("conversations_id") REFERENCES "public"."conversations"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_messages_fk" FOREIGN KEY ("messages_id") REFERENCES "public"."messages"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "payload_locked_documents_rels_conversations_id_idx" ON "payload_locked_documents_rels" USING btree ("conversations_id");
  CREATE INDEX "payload_locked_documents_rels_messages_id_idx" ON "payload_locked_documents_rels" USING btree ("messages_id");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "conversations_participants" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "conversations" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "messages_attachments" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "messages_read_by" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "messages" DISABLE ROW LEVEL SECURITY;
  DROP TABLE "conversations_participants" CASCADE;
  DROP TABLE "conversations" CASCADE;
  DROP TABLE "messages_attachments" CASCADE;
  DROP TABLE "messages_read_by" CASCADE;
  DROP TABLE "messages" CASCADE;
  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT "payload_locked_documents_rels_conversations_fk";
  
  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT "payload_locked_documents_rels_messages_fk";
  
  DROP INDEX "payload_locked_documents_rels_conversations_id_idx";
  DROP INDEX "payload_locked_documents_rels_messages_id_idx";
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN "conversations_id";
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN "messages_id";
  DROP TYPE "public"."enum_conversations_participants_role";
  DROP TYPE "public"."enum_conversations_status";
  DROP TYPE "public"."enum_messages_message_type";`)
}
