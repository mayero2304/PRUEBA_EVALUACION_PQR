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

El scaffold tecnico aun no esta generado. Cuando se implemente, el objetivo es que el proyecto pueda levantarse en menos de 10 minutos con:

```bash
cp .env.example .env
npm install
docker compose up -d db
npm run start:dev
```

Los comandos finales se actualizaran cuando existan los paquetes reales de `backend` y `frontend`.
