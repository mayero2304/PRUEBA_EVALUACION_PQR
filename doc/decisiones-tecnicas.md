# Decisiones tecnicas del MVP

## Enfoque general

Plantee la solucion como un MVP funcional para registrar, consultar y gestionar PQR, priorizando que el flujo principal pudiera probarse de punta a punta: registro publico, gestion interna, historial, autenticacion, notificaciones y ejecucion reproducible.

La arquitectura se organizo como un monorepo con backend y frontend separados para mantener responsabilidades claras y facilitar la revision tecnica del proyecto.

```text
backend/   API REST, reglas de negocio, autenticacion, persistencia y notificaciones
frontend/  Interfaz publica e interfaz interna de gestion
doc/       Analisis, modelo de datos, flujo y coleccion de pruebas
```

## Por que use NestJS

Elegi NestJS para el backend porque permite construir una API Node.js con una estructura modular y mantenible. Para este tipo de prueba, me parecio importante que el proyecto no quedara como un conjunto de archivos sueltos, sino como una aplicacion organizada por modulos, controladores, servicios, DTOs y guards.

NestJS tambien encaja bien con TypeScript, validacion de DTOs, inyeccion de dependencias, autenticacion con JWT y documentacion OpenAPI. Eso ayuda a que el codigo sea mas facil de revisar y extender.

En este MVP use NestJS para:

- Separar responsabilidades mediante modulos.
- Exponer endpoints REST claros.
- Validar entradas con DTOs y `ValidationPipe`.
- Proteger acciones internas con JWT y roles.
- Centralizar errores con un filtro global.
- Integrar Prisma como capa de acceso a datos.
- Exponer documentacion interactiva con Scalar/OpenAPI.
- Implementar notificaciones SSE para la campanita interna.

## Por que use Prisma y PostgreSQL

Use PostgreSQL porque es una base relacional adecuada para el dominio PQR: solicitantes, usuarios, PQR, seguimientos y notificaciones tienen relaciones claras y restricciones de integridad.

Use Prisma porque permite modelar las entidades de forma explicita, versionar migraciones y trabajar con consultas tipadas desde TypeScript. Esto reduce errores al consultar o actualizar datos y facilita entender el modelo de dominio.

## Por que use React en el frontend

Use React con Vite para construir una interfaz ligera y rapida de ejecutar. La aplicacion separa vistas publicas y vistas internas:

- La raiz publica permite radicar una PQR sin sidebar.
- El panel interno permite listar, filtrar, consultar detalle, gestionar estados y ver notificaciones.

El frontend se organizo en paginas, componentes reutilizables, servicios HTTP, tipos y contexto de autenticacion.

Aunque mi experiencia principal en frontend ha sido con Vue, los conceptos base son muy similares: componentes, layout, manejo de estado, servicios para consumir API y separacion de vistas. Por eso use React en este proyecto como una forma practica de adaptar esos conceptos al stack solicitado.

## Por que use JWT en cookie httpOnly

Para la autenticacion interna use JWT almacenado en cookie httpOnly. Esta decision evita guardar el token en `localStorage` y reduce la exposicion del token desde JavaScript del navegador.

No implemente refresh token para mantener el alcance controlado del MVP. La sesion queda simple: login, cookie httpOnly, validacion del token en endpoints protegidos y logout limpiando la cookie.

En la parte de autenticacion tome como base experiencia previa trabajando con aplicaciones NestJS. Al ser un framework modular, reutilice el enfoque de un modulo de autenticacion que ya conocia: controller para login/logout, service para validar credenciales y generar sesion, guard para proteger rutas y decoradores para roles. Lo adapte al alcance de esta prueba y a la decision de usar cookie httpOnly.

El modelo contempla roles internos (`agente`, `supervisor` y `admin`). En el alcance actual del MVP estos roles permiten identificar el tipo de usuario autenticado, pero no restringen permisos finos por pantalla o accion; los usuarios internos autenticados pueden acceder a las funcionalidades de gestion disponibles. Para una version futura se podria agregar un guard de permisos que valide acciones especificas por rol, por ejemplo permitir que un agente gestione PQR en estado inicial, que un supervisor escale casos y que solo un admin o supervisor pueda cerrar una PQR.

## Por que use SSE para notificaciones

Use SSE porque la necesidad era enviar eventos desde el backend hacia el frontend cuando se crea una nueva PQR. Para una campanita de notificaciones, SSE es suficiente y mas simple que WebSocket.

El frontend se suscribe con `EventSource` y el backend publica eventos cuando se genera una notificacion interna.

## Por que use Docker y Caddy

Agregue Docker para que la aplicacion pueda ejecutarse de forma reproducible. El stack local levanta base de datos, correo local, migraciones, backend y frontend.

Para el escenario productivo deje un `docker-compose.prod.yml` con Caddy como reverse proxy. Caddy recibe el trafico HTTP/HTTPS y enruta:

```text
/api/*  -> backend
/health -> backend
/*      -> frontend
```

Esta separacion permite que backend y frontend queden privados dentro de la red Docker y que solo Caddy sea la entrada publica.

## Uso de IA

Para esta prueba utilice Codex como herramienta de apoyo durante el desarrollo. El alcance del uso fue el siguiente:

- Apoyo en redaccion y organizacion de documentacion tecnica.
- Ayuda para estructurar y mejorar los archivos Markdown del analisis, decisiones tecnicas, README y guias de ejecucion.
- Generacion completa de las vistas del frontend en React, tomando como base los requerimientos funcionales del MVP y las decisiones de UX definidas durante el desarrollo.
- Apoyo puntual para revisar errores, comandos, validaciones y configuracion del proyecto.

La decision de arquitectura, el alcance funcional, la seleccion de NestJS como backend, el modelo modular, el uso de JWT en cookie httpOnly y la organizacion general del proyecto se hicieron con base en mi criterio y experiencia previa trabajando con NestJS. Codex se uso como acelerador para documentar, construir las vistas frontend y apoyar la implementacion, pero mantuve la revision y ajuste del resultado para que correspondiera al MVP planteado.

## Tradeoffs

Para mantener el MVP acotado tome algunas decisiones pragmaticas:

- No use refresh token.
- No implemente administracion completa de usuarios.
- No agregue una cola de trabajos para correo.
- No separe repositorios de persistencia sobre Prisma, porque el service aun es manejable para el alcance actual.

Estas decisiones reducen complejidad sin impedir que el proyecto pueda evolucionar.
