import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger, ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const logger = new Logger('Bootstrap');

  app.setGlobalPrefix('api');

  app.useGlobalPipes( // Se aplica un pipe global para validar los DTOs
    new ValidationPipe({
      whitelist: true, // Solo se aceptarán propiedades que estén definidas en el DTO
      forbidNonWhitelisted: true // Si se envía una propiedad que no está definida en el DTO, se lanzará un error
    })
  );

  await app.listen(process.env.PORT);
  logger.log(`Application listening on port ${process.env.PORT}`);
}
bootstrap();
