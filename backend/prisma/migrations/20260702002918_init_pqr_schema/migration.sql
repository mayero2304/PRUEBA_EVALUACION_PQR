-- CreateEnum
CREATE TYPE "TipoPqr" AS ENUM ('peticion', 'queja', 'reclamo');

-- CreateEnum
CREATE TYPE "PrioridadPqr" AS ENUM ('baja', 'media', 'alta', 'urgente');

-- CreateEnum
CREATE TYPE "EstadoPqr" AS ENUM ('recibida', 'en_gestion', 'resuelta', 'cerrada');

-- CreateEnum
CREATE TYPE "CanalPqr" AS ENUM ('web', 'email', 'presencial');

-- CreateEnum
CREATE TYPE "RolUsuario" AS ENUM ('agente', 'supervisor', 'admin');

-- CreateTable
CREATE TABLE "solicitantes" (
    "id" UUID NOT NULL,
    "nombre" VARCHAR(100) NOT NULL,
    "apellido" VARCHAR(100) NOT NULL,
    "identificacion" VARCHAR(30) NOT NULL,
    "email" VARCHAR(180) NOT NULL,
    "telefono" VARCHAR(30),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "solicitantes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "usuarios" (
    "id" UUID NOT NULL,
    "nombre" VARCHAR(120) NOT NULL,
    "email" VARCHAR(180) NOT NULL,
    "rol" "RolUsuario" NOT NULL,
    "password_hash" VARCHAR(255) NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "usuarios_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "pqr" (
    "id" UUID NOT NULL,
    "radicado" VARCHAR(30) NOT NULL,
    "tipo" "TipoPqr" NOT NULL,
    "titulo" VARCHAR(180) NOT NULL,
    "descripcion" TEXT NOT NULL,
    "categoria" VARCHAR(120) NOT NULL,
    "prioridad" "PrioridadPqr" NOT NULL,
    "estado" "EstadoPqr" NOT NULL DEFAULT 'recibida',
    "canal" "CanalPqr" NOT NULL DEFAULT 'web',
    "solicitante_id" UUID NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "pqr_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "seguimientos" (
    "id" UUID NOT NULL,
    "descripcion" TEXT NOT NULL,
    "tipo_accion" VARCHAR(80) NOT NULL,
    "fecha_registro" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "pqr_id" UUID NOT NULL,
    "usuario_id" UUID,

    CONSTRAINT "seguimientos_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "uk_solicitantes_identificacion" ON "solicitantes"("identificacion");

-- CreateIndex
CREATE UNIQUE INDEX "uk_usuarios_email" ON "usuarios"("email");

-- CreateIndex
CREATE UNIQUE INDEX "uk_pqr_radicado" ON "pqr"("radicado");

-- CreateIndex
CREATE INDEX "idx_pqr_estado" ON "pqr"("estado");

-- CreateIndex
CREATE INDEX "idx_pqr_tipo" ON "pqr"("tipo");

-- CreateIndex
CREATE INDEX "idx_pqr_prioridad" ON "pqr"("prioridad");

-- CreateIndex
CREATE INDEX "idx_pqr_categoria" ON "pqr"("categoria");

-- CreateIndex
CREATE INDEX "idx_pqr_created_at" ON "pqr"("created_at");

-- CreateIndex
CREATE INDEX "idx_pqr_filtros" ON "pqr"("estado", "tipo", "prioridad");

-- CreateIndex
CREATE INDEX "idx_seguimientos_pqr_fecha" ON "seguimientos"("pqr_id", "fecha_registro");

-- AddForeignKey
ALTER TABLE "pqr" ADD CONSTRAINT "pqr_solicitante_id_fkey" FOREIGN KEY ("solicitante_id") REFERENCES "solicitantes"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "seguimientos" ADD CONSTRAINT "seguimientos_pqr_id_fkey" FOREIGN KEY ("pqr_id") REFERENCES "pqr"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "seguimientos" ADD CONSTRAINT "seguimientos_usuario_id_fkey" FOREIGN KEY ("usuario_id") REFERENCES "usuarios"("id") ON DELETE SET NULL ON UPDATE CASCADE;
