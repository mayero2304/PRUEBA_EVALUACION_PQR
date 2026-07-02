import {
  CanalPqr,
  EstadoPqr,
  PrismaClient,
  PrioridadPqr,
  RolUsuario,
  TipoPqr,
} from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const admin = await prisma.usuario.upsert({
    where: { email: 'admin.pqr@example.com' },
    update: {},
    create: {
      nombre: 'Administrador PQR',
      email: 'admin.pqr@example.com',
      rol: RolUsuario.admin,
      passwordHash: 'local-development-password-hash',
    },
  });

  const agente = await prisma.usuario.upsert({
    where: { email: 'agente.pqr@example.com' },
    update: {},
    create: {
      nombre: 'Agente PQR',
      email: 'agente.pqr@example.com',
      rol: RolUsuario.agente,
      passwordHash: 'local-development-password-hash',
    },
  });

  const solicitante = await prisma.solicitante.upsert({
    where: { identificacion: '1000000001' },
    update: {},
    create: {
      nombre: 'Maria',
      apellido: 'Perez',
      identificacion: '1000000001',
      email: 'maria.perez@example.com',
      telefono: '3001234567',
    },
  });

  const pqr = await prisma.pqr.upsert({
    where: { radicado: 'PQR-2026-0001' },
    update: {},
    create: {
      radicado: 'PQR-2026-0001',
      tipo: TipoPqr.queja,
      titulo: 'Demora en la respuesta de solicitud',
      descripcion: 'La persona solicita seguimiento a una solicitud que no ha recibido respuesta.',
      categoria: 'Atencion al usuario',
      prioridad: PrioridadPqr.media,
      estado: EstadoPqr.recibida,
      canal: CanalPqr.web,
      solicitanteId: solicitante.id,
    },
  });

  const seguimientos = await prisma.seguimiento.count({
    where: { pqrId: pqr.id },
  });

  if (seguimientos === 0) {
    await prisma.seguimiento.createMany({
      data: [
        {
          descripcion: 'PQR registrada en el sistema.',
          tipoAccion: 'registro',
          pqrId: pqr.id,
          usuarioId: admin.id,
        },
        {
          descripcion: 'Caso asignado para revision inicial.',
          tipoAccion: 'asignacion',
          pqrId: pqr.id,
          usuarioId: agente.id,
        },
      ],
    });
  }
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
