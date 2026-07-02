import { ConflictException, Injectable } from '@nestjs/common';
import { CanalPqr, EstadoPqr, Prisma } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { CreatePqrDto, CreateSolicitanteDto } from './dto/create-pqr.dto';

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
}
