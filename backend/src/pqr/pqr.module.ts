import { Module } from '@nestjs/common';
import { AuthModule } from '../auth/auth.module';
import { PqrController } from './pqr.controller';
import { PqrService } from './pqr.service';

@Module({
  imports: [AuthModule],
  controllers: [PqrController],
  providers: [PqrService],
})
export class PqrModule {}
