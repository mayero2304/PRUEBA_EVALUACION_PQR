# Backend

API REST del sistema PQR construida con NestJS.

## Requisitos

- Node.js 20 o superior.
- PostgreSQL local disponible.
- Variables de entorno configuradas en `backend/.env`.

## Instalacion

```bash
cd backend
npm install
cp .env.example .env
```

## Ejecucion local

```bash
cd backend
npm run start:dev
```

El healthcheck queda disponible en:

```text
GET http://localhost:3000/health
```

## Prisma

Levantar PostgreSQL local desde la raiz del repositorio:

```bash
npm run db:up
```

Validar el schema:

```bash
cd backend
npx prisma validate
```

Generar Prisma Client:

```bash
cd backend
npx prisma generate
```

Crear una migracion local:

```bash
cd backend
npx prisma migrate dev --name init_pqr_schema
```

El comando de migracion requiere que PostgreSQL este levantado y que `DATABASE_URL` apunte a una base de datos valida.

Cargar datos basicos:

```bash
cd backend
npm run db:seed
```

## Build

```bash
cd backend
npm run build
```
