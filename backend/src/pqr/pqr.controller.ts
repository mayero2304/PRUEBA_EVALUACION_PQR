import {
  Body,
  Controller,
  Get,
  Param,
  ParseUUIDPipe,
  Post,
  Query,
} from '@nestjs/common';
import { CreatePqrDto } from './dto/create-pqr.dto';
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
}
