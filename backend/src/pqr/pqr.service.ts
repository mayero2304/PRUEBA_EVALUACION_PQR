import {
  ConflictException,
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CanalPqr, EstadoPqr, Prisma, PrioridadPqr } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { CreatePqrDto, CreateSolicitanteDto } from './dto/create-pqr.dto';
import { CreateSeguimientoDto, UpdatePqrStatusDto } from './dto/manage-pqr.dto';
import { QueryPqrDto } from './dto/query-pqr.dto';

@Injectable()
export class PqrService {
  private readonly allowedTransitions: Record<EstadoPqr, EstadoPqr[]> = {
    [EstadoPqr.recibida]: [EstadoPqr.en_gestion],
    [EstadoPqr.en_gestion]: [EstadoPqr.resuelta],
    [EstadoPqr.resuelta]: [EstadoPqr.cerrada],
    [EstadoPqr.cerrada]: [],
  };

  constructor(private readonly prisma: PrismaService) {}

  async create(createPqrDto: CreatePqrDto) {
    for (let attempt = 0; attempt < 3; attempt += 1) {
      try {
        return await this.prisma.$transaction(async (tx) => {
          const solicitante = await this.findOrCreateSolicitante(
            tx,
            createPqrDto.solicitante,
          );
          const radicado = await this.generateRadicado(tx, attempt);

          const pqr = await tx.pqr.create({
            data: {
              radicado,
              tipo: createPqrDto.tipo,
              titulo: createPqrDto.titulo,
              descripcion: createPqrDto.descripcion,
              categoria: createPqrDto.categoria,
              prioridad: createPqrDto.prioridad,
              canal: createPqrDto.canal ?? CanalPqr.web,
              estado: EstadoPqr.recibida,
              solicitanteId: solicitante.id,
            },
          });

          await tx.seguimiento.create({
            data: {
              descripcion: 'PQR registrada en estado recibida.',
              tipoAccion: 'registro',
              pqrId: pqr.id,
            },
          });

          return {
            id: pqr.id,
            radicado: pqr.radicado,
            estado: pqr.estado,
          };
        });
      } catch (error) {
        if (this.isRadicadoUniqueError(error)) {
          continue;
        }

        throw error;
      }
    }

    throw new ConflictException('No fue posible generar un radicado unico.');
  }

  async findAll(query: QueryPqrDto) {
    const page = query.page ?? 1;
    const limit = query.limit ?? 10;
    const skip = (page - 1) * limit;
    const where = this.buildWhere(query);

    const [items, total] = await this.prisma.$transaction([
      this.prisma.pqr.findMany({
        where,
        skip,
        take: limit,
        orderBy: {
          createdAt: 'desc',
        },
        select: {
          id: true,
          radicado: true,
          tipo: true,
          titulo: true,
          categoria: true,
          prioridad: true,
          estado: true,
          canal: true,
          createdAt: true,
          updatedAt: true,
          solicitante: {
            select: {
              id: true,
              nombre: true,
              apellido: true,
              identificacion: true,
              email: true,
            },
          },
        },
      }),
      this.prisma.pqr.count({ where }),
    ]);

    return {
      data: items,
      meta: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async findOne(id: string) {
    const pqr = await this.findDetail({
      id,
    });

    if (!pqr) {
      throw new NotFoundException('PQR no encontrada.');
    }

    return pqr;
  }

  async findByRadicado(radicado: string) {
    const pqr = await this.findDetail({
      radicado,
    });

    if (!pqr) {
      throw new NotFoundException('PQR no encontrada.');
    }

    return pqr;
  }

  async updateStatus(id: string, updatePqrStatusDto: UpdatePqrStatusDto) {
    return this.prisma.$transaction(async (tx) => {
      const currentPqr = await tx.pqr.findUnique({
        where: {
          id,
        },
        select: {
          id: true,
          estado: true,
          prioridad: true,
        },
      });

      if (!currentPqr) {
        throw new NotFoundException('PQR no encontrada.');
      }

      this.validateStatusUpdate(
        currentPqr.estado,
        updatePqrStatusDto.estado,
        currentPqr.prioridad,
        updatePqrStatusDto.prioridad,
      );

      const updatedPqr = await tx.pqr.update({
        where: {
          id,
        },
        data: {
          estado: updatePqrStatusDto.estado,
          prioridad: updatePqrStatusDto.prioridad ?? undefined,
        },
        select: {
          id: true,
          radicado: true,
          estado: true,
          prioridad: true,
          updatedAt: true,
        },
      });

      await tx.seguimiento.create({
        data: {
          descripcion: this.buildStatusSeguimientoDescription(
            currentPqr.estado,
            updatePqrStatusDto.estado,
            currentPqr.prioridad,
            updatePqrStatusDto.prioridad,
            updatePqrStatusDto.comentario,
          ),
          tipoAccion: this.resolveStatusActionType(
            updatePqrStatusDto.prioridad,
            currentPqr.prioridad,
            currentPqr.estado,
            updatePqrStatusDto.estado,
          ),
          pqrId: id,
        },
      });

      return updatedPqr;
    });
  }

  async createSeguimiento(
    id: string,
    createSeguimientoDto: CreateSeguimientoDto,
  ) {
    await this.ensurePqrExists(id);

    return this.prisma.seguimiento.create({
      data: {
        descripcion: createSeguimientoDto.descripcion,
        tipoAccion: createSeguimientoDto.tipoAccion ?? 'comentario',
        pqrId: id,
      },
    });
  }

  async findSeguimientos(id: string) {
    await this.ensurePqrExists(id);

    return this.prisma.seguimiento.findMany({
      where: {
        pqrId: id,
      },
      orderBy: {
        fechaRegistro: 'asc',
      },
      include: {
        usuario: {
          select: {
            id: true,
            nombre: true,
            email: true,
            rol: true,
          },
        },
      },
    });
  }

  private async findOrCreateSolicitante(
    tx: Prisma.TransactionClient,
    solicitanteDto: CreateSolicitanteDto,
  ) {
    const solicitante = await tx.solicitante.findFirst({
      where: {
        OR: [
          { identificacion: solicitanteDto.identificacion },
          { email: solicitanteDto.email },
        ],
      },
    });

    if (solicitante) {
      return tx.solicitante.update({
        where: { id: solicitante.id },
        data: {
          nombre: solicitanteDto.nombre,
          apellido: solicitanteDto.apellido,
          email: solicitanteDto.email,
          telefono: solicitanteDto.telefono,
        },
      });
    }

    return tx.solicitante.create({
      data: {
        nombre: solicitanteDto.nombre,
        apellido: solicitanteDto.apellido,
        identificacion: solicitanteDto.identificacion,
        email: solicitanteDto.email,
        telefono: solicitanteDto.telefono,
      },
    });
  }

  private async generateRadicado(
    tx: Prisma.TransactionClient,
    attempt: number,
  ) {
    const year = new Date().getFullYear();
    const prefix = `PQR-${year}`;
    const existingRadicados = await tx.pqr.findMany({
      where: {
        radicado: {
          startsWith: prefix,
        },
      },
      select: {
        radicado: true,
      },
    });

    const lastNumber = existingRadicados.reduce((max, pqr) => {
      const number = Number(pqr.radicado.split('-').at(-1));

      return Number.isFinite(number) && number > max ? number : max;
    }, 0);
    const nextNumber = lastNumber + attempt + 1;

    return `${prefix}-${nextNumber.toString().padStart(6, '0')}`;
  }

  private isRadicadoUniqueError(error: unknown) {
    return (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === 'P2002' &&
      Array.isArray(error.meta?.target) &&
      error.meta.target.includes('radicado')
    );
  }

  private async ensurePqrExists(id: string) {
    const pqr = await this.prisma.pqr.findUnique({
      where: {
        id,
      },
      select: {
        id: true,
      },
    });

    if (!pqr) {
      throw new NotFoundException('PQR no encontrada.');
    }

    return pqr;
  }

  private validateStatusUpdate(
    currentStatus: EstadoPqr,
    nextStatus: EstadoPqr,
    currentPriority: PrioridadPqr,
    nextPriority?: PrioridadPqr,
  ) {
    const hasStatusChange = currentStatus !== nextStatus;
    const hasPriorityChange = nextPriority && nextPriority !== currentPriority;

    if (!hasStatusChange && !hasPriorityChange) {
      throw new BadRequestException(
        'La PQR ya se encuentra en el estado y prioridad solicitados.',
      );
    }

    if (!hasStatusChange) {
      return;
    }

    const allowedNextStatuses = this.allowedTransitions[currentStatus];

    if (!allowedNextStatuses.includes(nextStatus)) {
      throw new BadRequestException(
        `Transicion de estado no permitida: ${currentStatus} -> ${nextStatus}.`,
      );
    }
  }

  private buildStatusSeguimientoDescription(
    currentStatus: EstadoPqr,
    nextStatus: EstadoPqr,
    currentPriority: PrioridadPqr,
    nextPriority?: PrioridadPqr,
    comment?: string,
  ) {
    const changes: string[] = [];

    if (currentStatus !== nextStatus) {
      changes.push(`Estado actualizado de ${currentStatus} a ${nextStatus}.`);
    }

    if (nextPriority && nextPriority !== currentPriority) {
      changes.push(
        `Prioridad actualizada de ${currentPriority} a ${nextPriority}.`,
      );
    }

    if (comment) {
      changes.push(comment);
    }

    return changes.join(' ');
  }

  private resolveStatusActionType(
    nextPriority: PrioridadPqr | undefined,
    currentPriority: PrioridadPqr,
    currentStatus: EstadoPqr,
    nextStatus: EstadoPqr,
  ) {
    const hasStatusChange = currentStatus !== nextStatus;
    const hasPriorityChange = nextPriority && nextPriority !== currentPriority;

    if (hasStatusChange && hasPriorityChange) {
      return 'cambio_estado_prioridad';
    }

    return hasPriorityChange ? 'cambio_prioridad' : 'cambio_estado';
  }

  private buildWhere(query: QueryPqrDto): Prisma.PqrWhereInput {
    return {
      tipo: query.tipo,
      estado: query.estado,
      prioridad: query.prioridad,
      categoria: query.categoria
        ? {
            contains: query.categoria,
            mode: 'insensitive',
          }
        : undefined,
    };
  }

  private findDetail(where: Prisma.PqrWhereUniqueInput) {
    return this.prisma.pqr.findUnique({
      where,
      include: {
        solicitante: true,
        seguimientos: {
          orderBy: {
            fechaRegistro: 'asc',
          },
          include: {
            usuario: {
              select: {
                id: true,
                nombre: true,
                email: true,
                rol: true,
              },
            },
          },
        },
      },
    });
  }
}
