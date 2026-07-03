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
import { CreatePqrDto } from './dto/create-pqr.dto';
import { CreateSeguimientoDto, UpdatePqrStatusDto } from './dto/manage-pqr.dto';
import { QueryPqrDto, SearchPqrDto } from './dto/query-pqr.dto';
import { PqrService } from './pqr.service';

@Controller('api/pqr')
export class PqrController {
  constructor(private readonly pqrService: PqrService) {}

  @Post()
  create(@Body() createPqrDto: CreatePqrDto) {
    return this.pqrService.create(createPqrDto);
  }

  @Get()
  findAll(@Query() query: QueryPqrDto) {
    return this.pqrService.findAll(query);
  }

  @Get('buscar')
  findByRadicado(@Query() query: SearchPqrDto) {
    return this.pqrService.findByRadicado(query.radicado);
  }

  @Get(':id')
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.pqrService.findOne(id);
  }

  @Patch(':id/estado')
  updateStatus(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updatePqrStatusDto: UpdatePqrStatusDto,
  ) {
    return this.pqrService.updateStatus(id, updatePqrStatusDto);
  }

  @Post(':id/seguimiento')
  createSeguimiento(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() createSeguimientoDto: CreateSeguimientoDto,
  ) {
    return this.pqrService.createSeguimiento(id, createSeguimientoDto);
  }

  @Get(':id/seguimiento')
  findSeguimientos(@Param('id', ParseUUIDPipe) id: string) {
    return this.pqrService.findSeguimientos(id);
  }
}
