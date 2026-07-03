import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { DevtoolsModule } from '@nestjs/devtools-integration';
import { PrismaModule } from './prisma/prisma.module';
import { PqrModule } from './pqr/pqr.module';
import { AppController } from './app.controller';
import { AppService } from './app.service';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    DevtoolsModule.register({
      http: process.env.NODE_ENV !== 'production',
      port: Number(process.env.DEVTOOLS_PORT ?? 8020),
    }),
    PrismaModule,
    PqrModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
