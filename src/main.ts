import { NestFactory } from '@nestjs/core';
import { AppModule } from './app/app.module';
import { ValidationPipe } from '@nestjs/common';
import { PrismaService } from './config/prisma/prisma.service';
import { GlobalExceptionFilter } from './config/filters/http-exception.filter';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const prismaService = app.get(PrismaService);
  prismaService.enableShutdownHooks(app);

  app.enableCors({
    origin: 'http://localhost:3000',
    credentials: true,
  });

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
    }),
  );

  app.useGlobalFilters(new GlobalExceptionFilter());

  const config = new DocumentBuilder()
    .setTitle('Task Manager API')
    .setDescription('Documentação da API do Task Manager')
    .setVersion('1.0.0')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('docs', app, document, {
    swaggerOptions: { persistAuthorization: true },
  });

  const port = process.env.PORT || 3001;
  await app.listen(port);
  console.log(`Server running on http://localhost:${port}`);
}

bootstrap().catch((err) => {
  console.error('Erro ao iniciar a aplicação:', err);
  process.exit(1);
});
