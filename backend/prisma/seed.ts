import {
  CanalPqr,
  EstadoPqr,
  Prisma,
  PrismaClient,
  PrioridadPqr,
  RolUsuario,
  TipoPqr,
} from '@prisma/client';

const prisma = new PrismaClient();

const passwordHash = 'local-development-password-hash';

const usuarios = [
  {
    nombre: 'Administrador PQR',
    email: 'admin.pqr@example.com',
    rol: RolUsuario.admin,
  },
  {
    nombre: 'Agente PQR',
    email: 'agente.pqr@example.com',
    rol: RolUsuario.agente,
  },
  {
    nombre: 'Supervisor PQR',
    email: 'supervisor.pqr@example.com',
    rol: RolUsuario.supervisor,
  },
];

const solicitantes = [
  {
    nombre: 'Maria',
    apellido: 'Perez',
    identificacion: '1000000001',
    email: 'maria.perez@example.com',
    telefono: '3001234567',
  },
  {
    nombre: 'Carlos',
    apellido: 'Ramirez',
    identificacion: '1000000002',
    email: 'carlos.ramirez@example.com',
    telefono: '3012345678',
  },
  {
    nombre: 'Laura',
    apellido: 'Gomez',
    identificacion: '1000000003',
    email: 'laura.gomez@example.com',
    telefono: '3023456789',
  },
  {
    nombre: 'Andres',
    apellido: 'Torres',
    identificacion: '1000000004',
    email: 'andres.torres@example.com',
    telefono: '3034567890',
  },
  {
    nombre: 'Paola',
    apellido: 'Martinez',
    identificacion: '1000000005',
    email: 'paola.martinez@example.com',
    telefono: '3045678901',
  },
  {
    nombre: 'Jorge',
    apellido: 'Castro',
    identificacion: '1000000006',
    email: 'jorge.castro@example.com',
    telefono: '3056789012',
  },
];

const pqrSeedData = [
  {
    radicado: 'PQR-2026-000001',
    solicitanteIdentificacion: '1000000001',
    tipo: TipoPqr.queja,
    titulo: 'Demora en la respuesta de solicitud',
    descripcion:
      'La persona solicita seguimiento a una solicitud que no ha recibido respuesta.',
    categoria: 'Atencion al usuario',
    prioridad: PrioridadPqr.media,
    estado: EstadoPqr.recibida,
    canal: CanalPqr.web,
  },
  {
    radicado: 'PQR-2026-000002',
    solicitanteIdentificacion: '1000000002',
    tipo: TipoPqr.peticion,
    titulo: 'Solicitud de actualizacion de datos',
    descripcion:
      'El solicitante requiere actualizar informacion de contacto registrada.',
    categoria: 'Datos personales',
    prioridad: PrioridadPqr.baja,
    estado: EstadoPqr.en_gestion,
    canal: CanalPqr.email,
  },
  {
    radicado: 'PQR-2026-000003',
    solicitanteIdentificacion: '1000000003',
    tipo: TipoPqr.reclamo,
    titulo: 'Inconformidad con respuesta recibida',
    descripcion:
      'La persona manifiesta inconformidad con la respuesta entregada previamente.',
    categoria: 'Servicio',
    prioridad: PrioridadPqr.alta,
    estado: EstadoPqr.resuelta,
    canal: CanalPqr.web,
  },
  {
    radicado: 'PQR-2026-000004',
    solicitanteIdentificacion: '1000000004',
    tipo: TipoPqr.queja,
    titulo: 'Dificultad para acceder al servicio',
    descripcion:
      'El solicitante reporta dificultad recurrente para acceder al servicio requerido.',
    categoria: 'Acceso',
    prioridad: PrioridadPqr.urgente,
    estado: EstadoPqr.en_gestion,
    canal: CanalPqr.presencial,
  },
  {
    radicado: 'PQR-2026-000005',
    solicitanteIdentificacion: '1000000005',
    tipo: TipoPqr.peticion,
    titulo: 'Consulta sobre tiempos de respuesta',
    descripcion:
      'La persona solicita informacion sobre tiempos estimados de respuesta.',
    categoria: 'Informacion',
    prioridad: PrioridadPqr.media,
    estado: EstadoPqr.cerrada,
    canal: CanalPqr.email,
  },
  {
    radicado: 'PQR-2026-000006',
    solicitanteIdentificacion: '1000000006',
    tipo: TipoPqr.reclamo,
    titulo: 'Correccion de registro asociado',
    descripcion:
      'Se solicita correccion de un registro asociado a la atencion recibida.',
    categoria: 'Registro',
    prioridad: PrioridadPqr.alta,
    estado: EstadoPqr.recibida,
    canal: CanalPqr.web,
  },
  {
    radicado: 'PQR-2026-000007',
    solicitanteIdentificacion: '1000000001',
    tipo: TipoPqr.peticion,
    titulo: 'Certificacion de tramite realizado',
    descripcion:
      'La persona solicita certificacion relacionada con un tramite ya efectuado.',
    categoria: 'Certificaciones',
    prioridad: PrioridadPqr.baja,
    estado: EstadoPqr.recibida,
    canal: CanalPqr.web,
  },
  {
    radicado: 'PQR-2026-000008',
    solicitanteIdentificacion: '1000000002',
    tipo: TipoPqr.queja,
    titulo: 'Atencion incompleta en punto presencial',
    descripcion:
      'El solicitante reporta que no recibio informacion completa en atencion presencial.',
    categoria: 'Atencion presencial',
    prioridad: PrioridadPqr.media,
    estado: EstadoPqr.en_gestion,
    canal: CanalPqr.presencial,
  },
  {
    radicado: 'PQR-2026-000009',
    solicitanteIdentificacion: '1000000003',
    tipo: TipoPqr.reclamo,
    titulo: 'Error en informacion entregada',
    descripcion:
      'La persona indica que la informacion entregada no corresponde a su solicitud.',
    categoria: 'Informacion',
    prioridad: PrioridadPqr.urgente,
    estado: EstadoPqr.resuelta,
    canal: CanalPqr.email,
  },
  {
    radicado: 'PQR-2026-000010',
    solicitanteIdentificacion: '1000000004',
    tipo: TipoPqr.peticion,
    titulo: 'Ampliacion de informacion del tramite',
    descripcion:
      'El solicitante requiere ampliacion de informacion para completar un tramite.',
    categoria: 'Tramites',
    prioridad: PrioridadPqr.media,
    estado: EstadoPqr.cerrada,
    canal: CanalPqr.web,
  },
  {
    radicado: 'PQR-2026-000011',
    solicitanteIdentificacion: '1000000005',
    tipo: TipoPqr.queja,
    titulo: 'Canal de contacto sin respuesta',
    descripcion:
      'La persona reporta que no ha recibido respuesta por el canal de contacto utilizado.',
    categoria: 'Canales digitales',
    prioridad: PrioridadPqr.alta,
    estado: EstadoPqr.recibida,
    canal: CanalPqr.email,
  },
  {
    radicado: 'PQR-2026-000012',
    solicitanteIdentificacion: '1000000006',
    tipo: TipoPqr.reclamo,
    titulo: 'Seguimiento a caso anterior',
    descripcion:
      'El solicitante requiere seguimiento a un caso previamente reportado.',
    categoria: 'Seguimiento',
    prioridad: PrioridadPqr.media,
    estado: EstadoPqr.en_gestion,
    canal: CanalPqr.web,
  },
];

type SeedUsuario = Awaited<ReturnType<typeof seedUsuarios>>;
type SeedSolicitante = Awaited<ReturnType<typeof seedSolicitantes>>;

async function seedUsuarios() {
  const result = await Promise.all(
    usuarios.map((usuario) =>
      prisma.usuario.upsert({
        where: { email: usuario.email },
        update: {
          nombre: usuario.nombre,
          rol: usuario.rol,
        },
        create: {
          ...usuario,
          passwordHash,
        },
      }),
    ),
  );

  return Object.fromEntries(result.map((usuario) => [usuario.rol, usuario]));
}

async function seedSolicitantes() {
  const result = await Promise.all(
    solicitantes.map((solicitante) =>
      prisma.solicitante.upsert({
        where: { identificacion: solicitante.identificacion },
        update: {
          nombre: solicitante.nombre,
          apellido: solicitante.apellido,
          email: solicitante.email,
          telefono: solicitante.telefono,
        },
        create: solicitante,
      }),
    ),
  );

  return Object.fromEntries(
    result.map((solicitante) => [solicitante.identificacion, solicitante]),
  );
}

async function seedPqr(
  usuariosPorRol: SeedUsuario,
  solicitantesPorIdentificacion: SeedSolicitante,
) {
  for (const item of pqrSeedData) {
    const solicitante =
      solicitantesPorIdentificacion[item.solicitanteIdentificacion];

    if (!solicitante) {
      throw new Error(
        `Solicitante no encontrado: ${item.solicitanteIdentificacion}`,
      );
    }

    const pqr = await prisma.pqr.upsert({
      where: { radicado: item.radicado },
      update: {
        tipo: item.tipo,
        titulo: item.titulo,
        descripcion: item.descripcion,
        categoria: item.categoria,
        prioridad: item.prioridad,
        estado: item.estado,
        canal: item.canal,
        solicitanteId: solicitante.id,
      },
      create: {
        radicado: item.radicado,
        tipo: item.tipo,
        titulo: item.titulo,
        descripcion: item.descripcion,
        categoria: item.categoria,
        prioridad: item.prioridad,
        estado: item.estado,
        canal: item.canal,
        solicitanteId: solicitante.id,
      },
    });

    await seedSeguimientos(pqr.id, item.estado, usuariosPorRol);
  }
}

async function seedSeguimientos(
  pqrId: string,
  estado: EstadoPqr,
  usuariosPorRol: SeedUsuario,
) {
  const totalSeguimientos = await prisma.seguimiento.count({
    where: { pqrId },
  });

  if (totalSeguimientos > 0) {
    return;
  }

  const agente = usuariosPorRol[RolUsuario.agente];
  const supervisor = usuariosPorRol[RolUsuario.supervisor];
  const admin = usuariosPorRol[RolUsuario.admin];
  const data: Prisma.SeguimientoCreateManyInput[] = [
    {
      descripcion: 'PQR registrada en estado recibida.',
      tipoAccion: 'registro',
      pqrId,
      usuarioId: agente?.id,
    },
  ];

  if (
    estado === EstadoPqr.en_gestion ||
    estado === EstadoPqr.resuelta ||
    estado === EstadoPqr.cerrada
  ) {
    data.push({
      descripcion: 'Caso asignado para revision y gestion inicial.',
      tipoAccion: 'asignacion',
      pqrId,
      usuarioId: agente?.id,
    });
  }

  if (estado === EstadoPqr.resuelta || estado === EstadoPqr.cerrada) {
    data.push({
      descripcion: 'Se registra respuesta de fondo para el solicitante.',
      tipoAccion: 'respuesta',
      pqrId,
      usuarioId: supervisor?.id,
    });
  }

  if (estado === EstadoPqr.cerrada) {
    data.push({
      descripcion: 'PQR cerrada despues de validar la respuesta entregada.',
      tipoAccion: 'cierre',
      pqrId,
      usuarioId: admin?.id,
    });
  }

  await prisma.seguimiento.createMany({ data });
}

async function main() {
  const usuariosPorRol = await seedUsuarios();
  const solicitantesPorIdentificacion = await seedSolicitantes();

  await seedPqr(usuariosPorRol, solicitantesPorIdentificacion);
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (error) => {
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  });
