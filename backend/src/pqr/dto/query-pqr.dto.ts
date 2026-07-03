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

export class QueryPqrDto {
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page?: number = 1;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(50)
  limit?: number = 10;

  @IsOptional()
  @IsEnum(TipoPqr)
  tipo?: TipoPqr;

  @IsOptional()
  @IsEnum(EstadoPqr)
  estado?: EstadoPqr;

  @IsOptional()
  @IsEnum(PrioridadPqr)
  prioridad?: PrioridadPqr;

  @IsOptional()
  @IsString()
  @MaxLength(120)
  categoria?: string;
}

export class SearchPqrDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(30)
  radicado: string;
}
