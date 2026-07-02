# PRUEBA_EVALUACION_PQR

MVP de un sistema web para la gestion de PQR (Peticiones, Quejas y Reclamos).

## Enlaces

- Repositorio: <https://github.com/mayero2304/PRUEBA_EVALUACION_PQR>
- Tablero Kanban: <https://github.com/users/mayero2304/projects/3>

## Stack definido

- Backend: NestJS.
- Frontend: React.
- Base de datos propuesta: PostgreSQL.
- ORM propuesto: Prisma.
- Gestion del proyecto: GitHub Projects con flujo Kanban.

## Alcance MVP

- Registrar una nueva PQR con tipo, categoria, solicitante, descripcion y prioridad.
- Listar PQR con filtros por tipo, estado, prioridad y categoria.
- Consultar el detalle de una PQR con historial de seguimiento.
- Cambiar estado y prioridad usando el flujo Recibida -> En gestion -> Resuelta -> Cerrada.
- Agregar entradas de seguimiento o comentarios internos.
- Buscar una PQR por numero de radicado.
- Frontend con listado, formulario de registro, detalle y panel de estadisticas basicas.

## Estructura inicial

```text
backend/   API REST con NestJS
frontend/  Aplicacion web con React
doc/       Analisis y diseno del MVP
```

## Documentacion del proyecto

- [Indice de analisis](ANALISIS.md)
- [Historias de usuario](doc/historias-usuario.md)
- [Modelo de datos y DER](doc/modelo-datos.md)
- [Flujo del proceso PQR](doc/flujo-proceso.md)

## Ejecucion local

### Instalacion

```bash
npm run install:all
```

### Backend

```bash
npm run dev:backend
```

Healthcheck:

```text
GET http://localhost:3000/health
```

### Frontend

```bash
npm run dev:frontend
```

### Build

```bash
npm run build
```

## Base de datos

El backend usa Prisma con PostgreSQL. Antes de ejecutar migraciones, copia el archivo de ejemplo y ajusta la cadena de conexion:

```bash
cd backend
cp .env.example .env
```

Comandos utiles de Prisma:

```bash
cd backend
npx prisma validate
npx prisma generate
npx prisma migrate dev --name init_pqr_schema
```

La migracion requiere que PostgreSQL este levantado y que `DATABASE_URL` apunte a una base de datos valida.

## Docker

Docker Compose queda como mejora bonus. Aun no se incluye `docker-compose.yml`, por lo tanto la ejecucion actual es por comandos separados de backend y frontend.
