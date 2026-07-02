import { Type } from 'class-transformer';
import {
  IsEmail,
  IsDefined,
  IsEnum,
  IsNotEmpty,
  IsObject,
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
  ValidateNested,
} from 'class-validator';
import { CanalPqr, PrioridadPqr, TipoPqr } from '@prisma/client';

export class CreateSolicitanteDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  nombre: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  apellido: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(30)
  identificacion: string;

  @IsEmail()
  @MaxLength(180)
  email: string;

  @IsOptional()
  @IsString()
  @MaxLength(30)
  telefono?: string;
}

export class CreatePqrDto {
  @IsDefined()
  @IsObject()
  @ValidateNested()
  @Type(() => CreateSolicitanteDto)
  solicitante: CreateSolicitanteDto;

  @IsEnum(TipoPqr)
  tipo: TipoPqr;

  @IsString()
  @IsNotEmpty()
  @MaxLength(180)
  titulo: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(10)
  descripcion: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(120)
  categoria: string;

  @IsEnum(PrioridadPqr)
  prioridad: PrioridadPqr;

  @IsOptional()
  @IsEnum(CanalPqr)
  canal?: CanalPqr;
}
