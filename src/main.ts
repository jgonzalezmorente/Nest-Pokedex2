import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix('api/v2');
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, //* Elimina "silenciosamente" las propiedades que no estén en el DTO. Previene la contaminación de objetos con datos innecesarios o maliciosos
      forbidNonWhitelisted: true,  //* Dispara una excepción en caso de venir propiedades no definidas en el DTO. Actúa antes que el whitelist
      transform: true, //* Los datos de entrada se conviertan en una instancia del DTO, permitiendo así trabajar con una instancia de la clase con todas sus propiedades y métodos.
      transformOptions: {
        enableImplicitConversion: true //* Convierte cadenas a tipos primitivos automáticamente durante el proceso de transformación.
      }
    })
  );
  await app.listen(+process.env.PORT);
}
bootstrap();
