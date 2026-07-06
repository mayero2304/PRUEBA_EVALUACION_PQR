-- CreateEnum
CREATE TYPE "TipoNotificacion" AS ENUM ('nueva_pqr');

-- CreateTable
CREATE TABLE "notificaciones" (
    "id" UUID NOT NULL,
    "titulo" VARCHAR(160) NOT NULL,
    "mensaje" VARCHAR(500) NOT NULL,
    "tipo" "TipoNotificacion" NOT NULL DEFAULT 'nueva_pqr',
    "leida" BOOLEAN NOT NULL DEFAULT false,
    "pqr_id" UUID,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "notificaciones_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "idx_notificaciones_leida_fecha" ON "notificaciones"("leida", "created_at");

-- CreateIndex
CREATE INDEX "idx_notificaciones_pqr" ON "notificaciones"("pqr_id");

-- AddForeignKey
ALTER TABLE "notificaciones" ADD CONSTRAINT "notificaciones_pqr_id_fkey" FOREIGN KEY ("pqr_id") REFERENCES "pqr"("id") ON DELETE CASCADE ON UPDATE CASCADE;
