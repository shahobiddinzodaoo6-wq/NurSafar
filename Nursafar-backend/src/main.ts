import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors({ origin: process.env.FRONTEND_URL || 'http://localhost:3001', credentials: true });

  app.useGlobalPipes(
    new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true, transform: true }),
  );

  app.setGlobalPrefix('api');

  const config = new DocumentBuilder()
    .setTitle('NurSafar Super App API')
    .setDescription(
      'Complete API for NurSafar — Umrah tours marketplace, crowdfunding, and logistics.',
    )
    .setVersion('1.0')
    .addBearerAuth()
    .addTag('auth', 'Authentication — login & register')
    .addTag('users', 'User management')
    .addTag('tours', 'Tour packages & bookings')
    .addTag('crowdfund', 'Crowdfunding campaigns & donations')
    .addTag('logistics', 'Transit/logistics bookings')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document);

  const port = process.env.PORT ?? 3000;
  await app.listen(port);
  console.log(`NurSafar API running on http://localhost:${port}/api`);
  console.log(`Swagger docs: http://localhost:${port}/api/docs`);
}
bootstrap();
