-- CreateEnum
CREATE TYPE "public"."UserStatus" AS ENUM ('PENDING', 'ACTIVE', 'SUSPENDED', 'DELETED');

-- CreateTable
CREATE TABLE "public"."users" (
    "id" TEXT NOT NULL,
    "email" VARCHAR(255) NOT NULL,
    "password_hash" VARCHAR(255),
    "avatar_url" VARCHAR(500),
    "provider" VARCHAR(20) NOT NULL DEFAULT 'local',
    "provider_id" VARCHAR(255),
    "status" "public"."UserStatus" NOT NULL DEFAULT 'PENDING',
    "is_email_verified" BOOLEAN NOT NULL DEFAULT false,
    "last_login_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted_at" TIMESTAMP(3),
    "role_id" TEXT NOT NULL,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."roles" (
    "id" TEXT NOT NULL,
    "name" VARCHAR(100) NOT NULL,
    "description" VARCHAR(500),
    "is_system" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted_at" TIMESTAMP(3),

    CONSTRAINT "roles_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."permissions" (
    "id" TEXT NOT NULL,
    "name" VARCHAR(100) NOT NULL,
    "description" VARCHAR(500),
    "resource" VARCHAR(100) NOT NULL,
    "action" VARCHAR(50) NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "permissions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."role_permissions" (
    "id" TEXT NOT NULL,
    "role_id" TEXT NOT NULL,
    "permission_id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "role_permissions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."audit_logs" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "action" VARCHAR(100) NOT NULL,
    "resource" VARCHAR(100),
    "resource_id" VARCHAR(100),
    "details" JSONB,
    "ip_address" VARCHAR(45),
    "user_agent" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "audit_logs_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "public"."users"("email");

-- CreateIndex
CREATE INDEX "users_email_status_idx" ON "public"."users"("email", "status");

-- CreateIndex
CREATE INDEX "users_provider_provider_id_idx" ON "public"."users"("provider", "provider_id");

-- CreateIndex
CREATE INDEX "users_created_at_idx" ON "public"."users"("created_at");

-- CreateIndex
CREATE INDEX "users_status_idx" ON "public"."users"("status");

-- CreateIndex
CREATE UNIQUE INDEX "roles_name_key" ON "public"."roles"("name");

-- CreateIndex
CREATE INDEX "roles_name_idx" ON "public"."roles"("name");

-- CreateIndex
CREATE INDEX "roles_is_system_idx" ON "public"."roles"("is_system");

-- CreateIndex
CREATE UNIQUE INDEX "permissions_name_key" ON "public"."permissions"("name");

-- CreateIndex
CREATE INDEX "permissions_resource_action_idx" ON "public"."permissions"("resource", "action");

-- CreateIndex
CREATE UNIQUE INDEX "permissions_resource_action_name_key" ON "public"."permissions"("resource", "action", "name");

-- CreateIndex
CREATE UNIQUE INDEX "role_permissions_role_id_permission_id_key" ON "public"."role_permissions"("role_id", "permission_id");

-- CreateIndex
CREATE INDEX "audit_logs_user_id_idx" ON "public"."audit_logs"("user_id");

-- CreateIndex
CREATE INDEX "audit_logs_action_idx" ON "public"."audit_logs"("action");

-- CreateIndex
CREATE INDEX "audit_logs_resource_resource_id_idx" ON "public"."audit_logs"("resource", "resource_id");

-- CreateIndex
CREATE INDEX "audit_logs_created_at_idx" ON "public"."audit_logs"("created_at");

-- AddForeignKey
ALTER TABLE "public"."users" ADD CONSTRAINT "users_role_id_fkey" FOREIGN KEY ("role_id") REFERENCES "public"."roles"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."role_permissions" ADD CONSTRAINT "role_permissions_role_id_fkey" FOREIGN KEY ("role_id") REFERENCES "public"."roles"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."role_permissions" ADD CONSTRAINT "role_permissions_permission_id_fkey" FOREIGN KEY ("permission_id") REFERENCES "public"."permissions"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."audit_logs" ADD CONSTRAINT "audit_logs_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
