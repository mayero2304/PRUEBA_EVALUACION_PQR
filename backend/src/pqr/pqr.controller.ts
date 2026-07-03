import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  ParseUUIDPipe,
  Post,
  Query,
} from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
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
  updateStatus(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updatePqrStatusDto: UpdatePqrStatusDto,
  ) {
    return this.pqrService.updateStatus(id, updatePqrStatusDto);
  }

  @ApiOperation({ summary: 'Agregar seguimiento a una PQR' })
  @Post(':id/seguimiento')
  createSeguimiento(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() createSeguimientoDto: CreateSeguimientoDto,
  ) {
    return this.pqrService.createSeguimiento(id, createSeguimientoDto);
  }

  @ApiOperation({ summary: 'Listar seguimientos de una PQR' })
  @Get(':id/seguimiento')
  findSeguimientos(@Param('id', ParseUUIDPipe) id: string) {
    return this.pqrService.findSeguimientos(id);
  }
}
