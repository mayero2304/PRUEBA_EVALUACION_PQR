import { EstadoPqr, PrioridadPqr } from '@prisma/client';
import {
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';

export class UpdatePqrStatusDto {
  @IsEnum(EstadoPqr)
  estado: EstadoPqr;

  @IsOptional()
  @IsEnum(PrioridadPqr)
  prioridad?: PrioridadPqr;

  @IsOptional()
  @IsString()
  @MaxLength(500)
  comentario?: string;
}

export class CreateSeguimientoDto {
  @IsString()
  @IsNotEmpty()
  @MinLength(5)
  descripcion: string;

  @IsOptional()
  @IsString()
  @MaxLength(80)
  tipoAccion?: string;
}
