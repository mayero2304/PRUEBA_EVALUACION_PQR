import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  ParseUUIDPipe,
  Post,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { RolUsuario } from '@prisma/client';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import type { AuthenticatedRequest } from '../auth/auth.types';
import { Roles } from '../auth/decorators/roles.decorator';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { CreatePqrDto } from './dto/create-pqr.dto';
import { CreateSeguimientoDto, UpdatePqrStatusDto } from './dto/manage-pqr.dto';
import { QueryPqrDto, SearchPqrDto } from './dto/query-pqr.dto';
import { PqrService } from './pqr.service';

@ApiTags('pqr')
@Controller('api/pqr')
export class PqrController {
  constructor(private readonly pqrService: PqrService) {}

  @ApiOperation({ summary: 'Registrar una nueva PQR' })
  @Post()
  create(@Body() createPqrDto: CreatePqrDto) {
    return this.pqrService.create(createPqrDto);
  }

  @ApiOperation({ summary: 'Listar PQR con filtros y paginacion' })
  @Get()
  findAll(@Query() query: QueryPqrDto) {
    return this.pqrService.findAll(query);
  }

  @ApiOperation({ summary: 'Buscar una PQR por radicado' })
  @Get('buscar')
  findByRadicado(@Query() query: SearchPqrDto) {
    return this.pqrService.findByRadicado(query.radicado);
  }

  @ApiOperation({ summary: 'Consultar detalle de una PQR por id' })
  @Get(':id')
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.pqrService.findOne(id);
  }

  @ApiOperation({ summary: 'Cambiar estado y prioridad de una PQR' })
  @Patch(':id/estado')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(RolUsuario.agente, RolUsuario.supervisor, RolUsuario.admin)
  updateStatus(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updatePqrStatusDto: UpdatePqrStatusDto,
    @Req() request: AuthenticatedRequest,
  ) {
    return this.pqrService.updateStatus(
      id,
      updatePqrStatusDto,
      request.user?.sub,
    );
  }

  @ApiOperation({ summary: 'Agregar seguimiento a una PQR' })
  @Post(':id/seguimiento')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(RolUsuario.agente, RolUsuario.supervisor, RolUsuario.admin)
  createSeguimiento(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() createSeguimientoDto: CreateSeguimientoDto,
    @Req() request: AuthenticatedRequest,
  ) {
    return this.pqrService.createSeguimiento(
      id,
      createSeguimientoDto,
      request.user?.sub,
    );
  }

  @ApiOperation({ summary: 'Listar seguimientos de una PQR' })
  @Get(':id/seguimiento')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(RolUsuario.agente, RolUsuario.supervisor, RolUsuario.admin)
  findSeguimientos(@Param('id', ParseUUIDPipe) id: string) {
    return this.pqrService.findSeguimientos(id);
  }
}
