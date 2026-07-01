# Historias de usuario

## HU-01 Registrar PQR

Como ciudadano o colaborador, quiero registrar una PQR con mis datos de contacto, tipo, categoria, prioridad y descripcion, para obtener un radicado y dejar constancia de mi solicitud.

Criterios de aceptacion:

- El sistema valida campos obligatorios.
- El sistema crea un numero de radicado unico.
- La PQR queda en estado `recibida`.

## HU-02 Listar y filtrar PQR

Como agente interno, quiero listar las PQR y filtrarlas por tipo, estado, prioridad y categoria, para priorizar la atencion diaria.

Criterios de aceptacion:

- El listado soporta filtros combinables.
- El listado muestra radicado, titulo, tipo, prioridad, estado y fecha de creacion.
- El listado permite abrir el detalle de una PQR.

## HU-03 Ver detalle e historial

Como agente interno, quiero ver la informacion completa de una PQR y su historial de seguimiento, para entender el contexto antes de actuar.

Criterios de aceptacion:

- El detalle muestra datos del solicitante y de la PQR.
- El historial aparece ordenado por fecha de registro.
- Si no hay seguimiento, se muestra un estado vacio claro.

## HU-04 Cambiar estado y prioridad

Como agente interno, quiero cambiar el estado y la prioridad de una PQR, para reflejar su avance real en el proceso.

Criterios de aceptacion:

- Solo se permiten transiciones validas: `recibida` -> `en_gestion` -> `resuelta` -> `cerrada`.
- Todo cambio relevante queda registrado en el historial.
- La fecha de actualizacion cambia con cada modificacion.

## HU-05 Agregar seguimiento

Como agente interno, quiero agregar comentarios o acciones de seguimiento a una PQR, para documentar la gestion realizada.

Criterios de aceptacion:

- El seguimiento queda asociado a una PQR.
- El seguimiento guarda descripcion, tipo de accion, fecha y usuario si existe autenticacion.
- El historial se actualiza despues de crear la entrada.

## HU-06 Buscar por radicado

Como ciudadano o colaborador, quiero consultar una PQR por numero de radicado, para conocer su estado sin revisar todo el listado.

Criterios de aceptacion:

- La busqueda retorna la PQR exacta si el radicado existe.
- Si no existe, el sistema responde con un mensaje claro.
- La consulta no expone datos sensibles innecesarios.

## HU-07 Ver estadisticas basicas

Como supervisor, quiero ver conteos de PQR por estado y tipo, para identificar carga operativa y tendencias basicas.

Criterios de aceptacion:

- El panel muestra cantidad por estado.
- El panel muestra cantidad por tipo.
- La informacion se actualiza con los datos actuales de la base.

## HU-08 Autenticacion y roles

Como administrador, quiero gestionar acceso por roles de agente, supervisor y admin, para proteger acciones internas del sistema.

Criterios de aceptacion:

- Los usuarios internos inician sesion.
- Las acciones internas requieren autenticacion.
- Las acciones administrativas quedan limitadas al rol correspondiente.
