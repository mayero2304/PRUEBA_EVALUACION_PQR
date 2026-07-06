# Flujo del proceso PQR

```mermaid
flowchart TD
  A[Ciudadano o colaborador registra PQR] --> B{Datos validos?}
  B -- No --> C[Mostrar errores de validacion]
  C --> A
  B -- Si --> D[Crear solicitante si aplica]
  D --> E[Crear PQR con radicado]
  E --> F[Estado: recibida]
  F --> N[Crear seguimiento inicial]
  N --> O[Crear notificacion interna y enviar correo de confirmacion]
  O --> G[Usuario interno revisa y clasifica]
  G --> H[Estado: en_gestion]
  H --> I[Agregar seguimiento interno]
  I --> J{La solicitud esta resuelta?}
  J -- No --> I
  J -- Si --> K[Estado: resuelta]
  K --> L{Se confirma cierre?}
  L -- No --> K
  L -- Si --> M[Estado: cerrada]
```

## Reglas de transicion

- `recibida` solo puede pasar a `en_gestion`.
- `en_gestion` puede recibir multiples seguimientos antes de pasar a `resuelta`.
- `resuelta` solo puede pasar a `cerrada`.
- `cerrada` no permite nuevas transiciones de estado en el flujo base del MVP.
- La prioridad puede actualizarse desde el endpoint de gestion sin cambiar el estado, siempre que exista un cambio real de prioridad.

## Actores por etapa

| Etapa | Actor principal | Resultado |
| --- | --- | --- |
| Registro de PQR | Ciudadano o colaborador | PQR creada con radicado y estado `recibida`. |
| Notificacion | Sistema | Notificacion interna creada y correo de confirmacion enviado al solicitante. |
| Revision inicial | Usuario interno autenticado | PQR clasificada y movida a `en_gestion`. |
| Seguimiento | Usuario interno autenticado | Comentarios o acciones internas agregadas al historial. |
| Resolucion | Usuario interno autenticado | PQR marcada como `resuelta`. |
| Cierre | Usuario interno autenticado | PQR marcada como `cerrada`. |

## Transiciones permitidas

| Estado origen | Estado destino | Actor permitido | Observacion |
| --- | --- | --- | --- |
| `recibida` | `en_gestion` | Usuario interno autenticado | Inicia gestion formal de la solicitud. |
| `en_gestion` | `resuelta` | Usuario interno autenticado | Requiere dejar seguimiento de la accion realizada. |
| `resuelta` | `cerrada` | Usuario interno autenticado | Confirma cierre del caso. |

No se permite cambiar desde `cerrada` en el flujo base del MVP. Los roles `agente`, `supervisor` y `admin` quedan registrados en el usuario autenticado, pero los permisos finos por accion se dejan como evolucion futura.
