# PRUEBA_EVALUACION_PQR

MVP de un sistema web para la gestion de PQR (Peticiones, Quejas y Reclamos).

## Enlaces

- Repositorio: <https://github.com/mayero2304/PRUEBA_EVALUACION_PQR>
- Tablero Kanban: <https://github.com/users/mayero2304/projects/3/views/1?reload=1>

## Documentacion del proyecto

- [Historias de usuario](doc/historias-usuario.md)
- [Decisiones tecnicas](doc/decisiones-tecnicas.md)
- [Modelo de datos y DER](doc/modelo-datos.md)
- [Flujo del proceso PQR](doc/flujo-proceso.md)
- [Coleccion Postman](doc/postman/PRUEBA_EVALUACION_PQR.postman_collection.json)

Para importar la coleccion en Postman, use el archivo:

```text
doc/postman/PRUEBA_EVALUACION_PQR.postman_collection.json
```

Orden recomendado en Postman:

1. `Sistema -> Healthcheck`
2. `Auth -> Login interno`
3. `PQR -> Crear PQR`
4. `Gestion interna PQR -> Login requerido para acciones internas`
5. `Gestion interna PQR -> Agregar seguimiento`
6. `Gestion interna PQR -> Listar seguimientos`
7. `Gestion interna PQR -> Cambiar estado a en gestion`

Los documentos de modelo de datos y flujo usan diagramas Mermaid. En GitHub se visualizan directamente; en VS Code se puede usar la extension [Mermaid](https://marketplace.visualstudio.com/items?itemName=MermaidChart.vscode-mermaid-chart) para previsualizarlos localmente.

## Alcance MVP

- Registrar una nueva PQR con tipo, categoria, solicitante, descripcion y prioridad.
- Listar PQR con filtros por tipo, estado, prioridad y categoria.
- Consultar el detalle de una PQR con historial de seguimiento.
- Cambiar estado y prioridad usando el flujo Recibida -> En gestion -> Resuelta -> Cerrada.
- Agregar entradas de seguimiento o comentarios internos.
- Buscar una PQR por numero de radicado.
- Frontend con listado, formulario de registro, detalle y panel de estadisticas basicas.
- Notificaciones internas por SSE y correo local de confirmacion usando Mailpit.

## Ejecucion rapida

Salvo que el bloque indique un `cd` especifico, ejecuta los comandos desde la raiz del proyecto.

| Modo | Uso recomendado |
| --- | --- |
| [Local PC](#local-pc) | Desarrollo con Node.js, PostgreSQL y Mailpit locales por Docker. |
| [Local Docker](#local-docker) | Levantar todo el stack con Docker Compose. |
| [Prod Docker](#prod-docker) | Ejecutar el stack con Caddy como reverse proxy. |

### Local PC

Requisitos usados en esta entrega:

```text
Node.js: 26.4.0
npm:     11.16.0
```

El proyecto requiere Node.js 20 o superior.

Levantar servicios de apoyo:

```bash
npm run db:up
npm run mail:up
```

Configurar variables del backend:

```bash
cd backend
cp .env.example .env
npx prisma validate
npx prisma generate
npx prisma migrate dev --name init_pqr_schema
npm run db:seed
cd ..
```

Instalar dependencias del backend y frontend:

```bash
npm run install:all
```

Ese comando instala dependencias en ambos proyectos. Es equivalente a ejecutar:

```bash
npm install --prefix backend
npm install --prefix frontend
```

Luego ejecuta el backend y el frontend en terminales separadas.

Terminal 1:

```bash
npm run dev:backend
```

Terminal 2:

```bash
npm run dev:frontend
```

Verificacion local:

```bash
npm run build
npm run lint
npm test --prefix backend -- --runInBand
```

URLs:

- Frontend: <http://localhost:5173>
- Backend: <http://localhost:3000>
- Scalar: <http://localhost:3000/api/reference>
- Mailpit: <http://localhost:8025>

### Local Docker

Requisitos usados en esta entrega:

```text
Docker:         29.6.1
Docker Compose: 5.1.4
```

Levantar el stack completo:

```bash
npm run docker:local:up
```

Este comando construye y levanta PostgreSQL, Mailpit, migraciones, backend y frontend.

URLs:

- Frontend: <http://localhost:5173>
- Backend: <http://localhost:3000>
- Scalar: <http://localhost:3000/api/reference>
- Mailpit: <http://localhost:8025>

Apagar:

```bash
npm run docker:local:down
```

### Prod Docker

Crear variables de produccion desde el ejemplo:

```bash
cp .env.production.example .env.production
```

Para revision local, el archivo copiado usa `APP_DOMAIN=:80`, por eso la aplicacion queda disponible en `http://localhost`. Es lo mismo que `http://localhost:80`, pero el navegador oculta el puerto HTTP por defecto.

En este modo Caddy recibe el trafico en el puerto `80` y redirige internamente al frontend y al backend. Para un dominio real se deben ajustar `APP_DOMAIN`, `CORS_ORIGIN`, `JWT_SECRET`, credenciales de base de datos y SMTP.

Levantar:

```bash
npm run docker:prod:up
```

URL local por Caddy:

- Aplicacion: <http://localhost>

Apagar:

```bash
npm run docker:prod:down
```

## Stack definido

- Backend: NestJS.
- Frontend: React.
- Base de datos propuesta: PostgreSQL.
- ORM propuesto: Prisma.
- Gestion del proyecto: GitHub Projects con flujo Kanban.
