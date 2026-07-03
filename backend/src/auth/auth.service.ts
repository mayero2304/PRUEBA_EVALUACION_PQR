import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { compare } from 'bcryptjs';
import { PrismaService } from '../prisma/prisma.service';
import { LoginDto } from './dto/login.dto';
import { AuthUser } from './auth.types';

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
  ) {}

  async login(loginDto: LoginDto) {
    const usuario = await this.prisma.usuario.findUnique({
      where: {
        email: loginDto.email,
      },
    });

    const passwordMatches = usuario
      ? await compare(loginDto.password, usuario.passwordHash)
      : false;

    if (!usuario || !passwordMatches) {
      throw new UnauthorizedException('Credenciales invalidas.');
    }

    const user: AuthUser = {
      sub: usuario.id,
      email: usuario.email,
      nombre: usuario.nombre,
      rol: usuario.rol,
    };

    return {
      user,
      accessToken: await this.jwtService.signAsync(user),
    };
  }
}
