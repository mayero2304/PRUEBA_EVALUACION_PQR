import { Type } from 'class-transformer';
import {
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  Max,
  MaxLength,
  Min,
} from 'class-validator';
import { EstadoPqr, PrioridadPqr, TipoPqr } from '@prisma/client';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class QueryPqrDto {
  @ApiPropertyOptional({ example: 1, minimum: 1 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page?: number = 1;

  @ApiPropertyOptional({ example: 10, minimum: 1, maximum: 50 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(50)
  limit?: number = 10;

  @ApiPropertyOptional({ enum: TipoPqr, example: TipoPqr.queja })
  @IsOptional()
  @IsEnum(TipoPqr)
  tipo?: TipoPqr;

  @ApiPropertyOptional({ enum: EstadoPqr, example: EstadoPqr.recibida })
  @IsOptional()
  @IsEnum(EstadoPqr)
  estado?: EstadoPqr;

  @ApiPropertyOptional({ enum: PrioridadPqr, example: PrioridadPqr.media })
  @IsOptional()
  @IsEnum(PrioridadPqr)
  prioridad?: PrioridadPqr;

  @ApiPropertyOptional({ example: 'Atencion al usuario' })
  @IsOptional()
  @IsString()
  @MaxLength(120)
  categoria?: string;
}

export class SearchPqrDto {
  @ApiProperty({ example: 'PQR-2026-000001' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(30)
  radicado: string;
}
