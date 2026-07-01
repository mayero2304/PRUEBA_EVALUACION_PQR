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

### Backend

```bash
cd backend
npm install
npm run start:dev
```

### Frontend

```bash
cd frontend
npm install
npm run dev
```

### Build

```bash
cd backend
npm run build

cd ../frontend
npm run build
```

## Docker

Docker Compose queda como mejora bonus. Aun no se incluye `docker-compose.yml`, por lo tanto la ejecucion actual es por comandos separados de backend y frontend.
