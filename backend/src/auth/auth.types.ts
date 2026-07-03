import { Request } from 'express';
import { RolUsuario } from '@prisma/client';

export type AuthUser = {
  sub: string;
  email: string;
  nombre: string;
  rol: RolUsuario;
};

export type JwtPayload = AuthUser;

export type AuthenticatedRequest = Request & {
  user?: AuthUser;
  cookies?: Record<string, string | undefined>;
};
