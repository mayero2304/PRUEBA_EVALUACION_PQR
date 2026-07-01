# Contrato API inicial

Base path: `/api`

| Metodo | Endpoint | Proposito |
| --- | --- | --- |
| `GET` | `/pqr` | Listar PQR con filtros por tipo, estado, prioridad y categoria. |
| `POST` | `/pqr` | Crear una nueva PQR con solicitante y datos de la solicitud. |
| `GET` | `/pqr/:id` | Obtener detalle completo de una PQR. |
| `PATCH` | `/pqr/:id/estado` | Cambiar estado y/o prioridad. |
| `POST` | `/pqr/:id/seguimiento` | Agregar entrada de seguimiento. |
| `GET` | `/pqr/:id/seguimiento` | Listar historial de seguimiento. |
| `GET` | `/pqr/buscar?radicado=...` | Buscar una PQR por numero de radicado. |

## Query params de listado

- `tipo`: `peticion`, `queja`, `reclamo`.
- `estado`: `recibida`, `en_gestion`, `resuelta`, `cerrada`.
- `prioridad`: `baja`, `media`, `alta`, `urgente`.
- `categoria`: texto libre normalizado.
- `page` y `limit`: paginacion.

## Payload inicial para crear PQR

```json
{
  "tipo": "peticion",
  "titulo": "Solicitud de informacion",
  "descripcion": "Necesito conocer el estado de mi tramite.",
  "categoria": "Atencion al usuario",
  "prioridad": "media",
  "canal": "web",
  "solicitante": {
    "nombre": "Ana",
    "apellido": "Perez",
    "identificacion": "123456789",
    "email": "ana@example.com",
    "telefono": "3001234567"
  }
}
```
