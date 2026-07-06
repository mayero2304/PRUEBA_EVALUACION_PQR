import {
  Controller,
  Get,
  MessageEvent,
  Param,
  ParseUUIDPipe,
  Patch,
  Sse,
  UseGuards,
} from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { RolUsuario } from '@prisma/client';
import { Observable } from 'rxjs';
import { Roles } from '../auth/decorators/roles.decorator';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { NotificacionesService } from './notificaciones.service';

@ApiTags('notificaciones')
@Controller('api/notificaciones')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(RolUsuario.agente, RolUsuario.supervisor, RolUsuario.admin)
export class NotificacionesController {
  constructor(private readonly notificacionesService: NotificacionesService) {}

  @ApiOperation({ summary: 'Listar notificaciones internas recientes' })
  @Get()
  findRecent() {
    return this.notificacionesService.findRecent();
  }

  @ApiOperation({ summary: 'Escuchar notificaciones internas por SSE' })
  @Sse('stream')
  stream(): Observable<MessageEvent> {
    return this.notificacionesService.stream();
  }

  @ApiOperation({ summary: 'Marcar notificacion como leida' })
  @Patch(':id/leida')
  markAsRead(@Param('id', ParseUUIDPipe) id: string) {
    return this.notificacionesService.markAsRead(id);
  }
}
