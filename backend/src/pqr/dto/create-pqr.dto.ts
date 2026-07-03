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
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateSolicitanteDto {
  @ApiProperty({ example: 'Maria' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  nombre: string;

  @ApiProperty({ example: 'Perez' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  apellido: string;

  @ApiProperty({ example: '1000000001' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(30)
  identificacion: string;

  @ApiProperty({ example: 'maria.perez@example.com' })
  @IsEmail()
  @MaxLength(180)
  email: string;

  @ApiPropertyOptional({ example: '3001234567' })
  @IsOptional()
  @IsString()
  @MaxLength(30)
  telefono?: string;
}

export class CreatePqrDto {
  @ApiProperty({ type: CreateSolicitanteDto })
  @IsDefined()
  @IsObject()
  @ValidateNested()
  @Type(() => CreateSolicitanteDto)
  solicitante: CreateSolicitanteDto;

  @ApiProperty({ enum: TipoPqr, example: TipoPqr.queja })
  @IsEnum(TipoPqr)
  tipo: TipoPqr;

  @ApiProperty({ example: 'Demora en la respuesta de solicitud' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(180)
  titulo: string;

  @ApiProperty({
    example: 'La persona solicita seguimiento a una solicitud sin respuesta.',
  })
  @IsString()
  @IsNotEmpty()
  @MinLength(10)
  descripcion: string;

  @ApiProperty({ example: 'Atencion al usuario' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(120)
  categoria: string;

  @ApiProperty({ enum: PrioridadPqr, example: PrioridadPqr.media })
  @IsEnum(PrioridadPqr)
  prioridad: PrioridadPqr;

  @ApiPropertyOptional({ enum: CanalPqr, example: CanalPqr.web })
  @IsOptional()
  @IsEnum(CanalPqr)
  canal?: CanalPqr;
}
