import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { apiReference } from '@scalar/nestjs-api-reference';
import { AppModule } from './app.module';
import { HttpExceptionFilter } from './common/filters/http-exception.filter';

async function bootstrap() {
  const isProduction = process.env.NODE_ENV === 'production';
  const app = await NestFactory.create(AppModule, {
    snapshot: !isProduction,
  });
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );
  app.useGlobalFilters(new HttpExceptionFilter());

  const swaggerConfig = new DocumentBuilder()
    .setTitle('PRUEBA_EVALUACION_PQR API')
    .setDescription('API REST para gestionar PQR del MVP.')
    .setVersion('1.0.0')
    .addTag('pqr')
    .build();
  const swaggerDocument = SwaggerModule.createDocument(app, swaggerConfig);
  app.use(
    '/api/reference',
    apiReference({
      content: swaggerDocument,
      theme: 'default',
    }),
  );

  await app.listen(process.env.PORT ?? 3000);
}
void bootstrap();
