import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString, MinLength } from 'class-validator';

export class LoginDto {
  @ApiProperty({ example: 'agente.pqr@example.com' })
  @IsEmail()
  email: string;

  @ApiProperty({ example: 'PqrDemo2026!' })
  @IsString()
  @MinLength(8)
  password: string;
}
