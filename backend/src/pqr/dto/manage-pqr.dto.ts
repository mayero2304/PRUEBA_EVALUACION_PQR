import { EstadoPqr, PrioridadPqr } from '@prisma/client';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';

export class UpdatePqrStatusDto {
  @ApiProperty({ enum: EstadoPqr, example: EstadoPqr.en_gestion })
  @IsEnum(EstadoPqr)
  estado: EstadoPqr;

  @ApiPropertyOptional({ enum: PrioridadPqr, example: PrioridadPqr.alta })
  @IsOptional()
  @IsEnum(PrioridadPqr)
  prioridad?: PrioridadPqr;

  @ApiPropertyOptional({ example: 'Caso tomado para gestion inicial.' })
  @IsOptional()
  @IsString()
  @MaxLength(500)
  comentario?: string;
}

export class CreateSeguimientoDto {
  @ApiProperty({
    example: 'Se agrega comentario interno de seguimiento.',
  })
  @IsString()
  @IsNotEmpty()
  @MinLength(5)
  descripcion: string;

  @ApiPropertyOptional({ example: 'comentario' })
  @IsOptional()
  @IsString()
  @MaxLength(80)
  tipoAccion?: string;
}
