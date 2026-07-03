import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import type { AuthenticatedRequest, JwtPayload } from '../auth.types';

function isJwtPayload(value: unknown): value is JwtPayload {
  if (!value || typeof value !== 'object') {
    return false;
  }

  const payload = value as Record<string, unknown>;

  return (
    typeof payload.sub === 'string' &&
    typeof payload.email === 'string' &&
    typeof payload.nombre === 'string' &&
    (payload.rol === 'agente' ||
      payload.rol === 'supervisor' ||
      payload.rol === 'admin')
  );
}

@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(private readonly jwtService: JwtService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<AuthenticatedRequest>();
    const token = this.extractToken(request);

    if (!token) {
      throw new UnauthorizedException('Autenticacion requerida.');
    }

    try {
      const payload: unknown = await this.jwtService.verifyAsync(token);

      if (!isJwtPayload(payload)) {
        throw new UnauthorizedException('Token invalido.');
      }

      request.user = payload;
      return true;
    } catch {
      throw new UnauthorizedException('Token invalido o expirado.');
    }
  }

  private extractToken(request: AuthenticatedRequest): string | undefined {
    const cookies = request.cookies as unknown as
      Record<string, unknown> | undefined;
    const cookieToken = cookies?.['access_token'];

    if (typeof cookieToken === 'string') {
      return cookieToken;
    }

    const [type, token] = request.headers.authorization?.split(' ') ?? [];

    return type === 'Bearer' ? token : undefined;
  }
}
