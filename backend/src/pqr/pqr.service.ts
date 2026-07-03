import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CanalPqr, EstadoPqr, Prisma } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { CreatePqrDto, CreateSolicitanteDto } from './dto/create-pqr.dto';
import { QueryPqrDto } from './dto/query-pqr.dto';

@Injectable()
export class PqrService {
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
    const lastPqr = await tx.pqr.findFirst({
      where: {
        radicado: {
          startsWith: prefix,
        },
      },
      orderBy: {
        radicado: 'desc',
      },
      select: {
        radicado: true,
      },
    });

    const lastNumber = lastPqr ? Number(lastPqr.radicado.split('-').at(-1)) : 0;
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
