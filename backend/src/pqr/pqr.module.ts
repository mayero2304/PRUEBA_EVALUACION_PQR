import { Module } from '@nestjs/common';
import { AuthModule } from '../auth/auth.module';
import { NotificacionesModule } from '../notificaciones/notificaciones.module';
import { PqrController } from './pqr.controller';
import { PqrService } from './pqr.service';

@Module({
  imports: [AuthModule, NotificacionesModule],
  controllers: [PqrController],
  providers: [PqrService],
})
export class PqrModule {}
