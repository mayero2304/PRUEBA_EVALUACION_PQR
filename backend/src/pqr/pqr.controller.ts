import { Body, Controller, Post } from '@nestjs/common';
import { CreatePqrDto } from './dto/create-pqr.dto';
import { PqrService } from './pqr.service';

@Controller('api/pqr')
export class PqrController {
  constructor(private readonly pqrService: PqrService) {}

  @Post()
  create(@Body() createPqrDto: CreatePqrDto) {
    return this.pqrService.create(createPqrDto);
  }
}
