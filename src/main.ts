import { NestFactory } from '@nestjs/core';
import { Logger, ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';

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

  const config = new DocumentBuilder()
    .setTitle('Teslo Example')
    .setDescription('Teslo shop API description')
    .setVersion('1.0')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  await app.listen(process.env.PORT);
  logger.log(`Application listening on port ${process.env.PORT}`);
}
bootstrap();
