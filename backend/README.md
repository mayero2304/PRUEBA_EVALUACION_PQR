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

La documentacion interactiva de la API queda disponible en Scalar:

```text
http://localhost:3000/api/reference
```

Nest Devtools queda habilitado en desarrollo para inspeccionar modulos, providers y dependencias de la aplicacion. El servidor local usa `DEVTOOLS_PORT`, por defecto `8020`.

## Autenticacion

Usuarios demo creados por el seed:

```text
admin.pqr@example.com
agente.pqr@example.com
supervisor.pqr@example.com
```

Contrasena demo:

```text
PqrDemo2026!
```

Login:

```text
POST http://localhost:3000/api/auth/login
```

El token JWT se entrega en cookie httpOnly `access_token`. No se usa refresh token para mantener el alcance acotado del MVP.

## Notificaciones y correo local

Cuando se registra una PQR publica, el backend crea una notificacion interna y envia un correo de confirmacion al solicitante.

Levantar Mailpit desde la raiz del repositorio:

```bash
npm run mail:up
```

Variables de correo usadas por el backend:

```text
MAIL_HOST=localhost
MAIL_PORT=1025
MAIL_FROM=PQR <no-reply@pqr.local>
```

La bandeja local queda disponible en:

```text
http://localhost:8025
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
npm run start:prod
```

## Docker

La imagen del backend se construye con `backend/Dockerfile` usando multi-stage. El target `runtime` ejecuta la API compilada y el target `migrate` ejecuta migraciones Prisma con `prisma migrate deploy`.

Desde la raiz del repositorio:

```bash
npm run docker:local:up
```
