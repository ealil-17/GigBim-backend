import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Set global prefix for all routes
  app.setGlobalPrefix('api');

  app.enableCors();
  app.useGlobalPipes(new ValidationPipe());

  // Swagger / OpenAPI setup
  const config = new DocumentBuilder()
    .setTitle('nestjs-starter API')
    .setDescription('nestjs-starter API documentation')
    .setVersion('1.0')
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        name: 'JWT',
        description: 'Enter JWT token',
        in: 'header',
      },
      'JWT',
    )
    .addOAuth2(
      {
        type: 'oauth2',
        flows: {
          implicit: {
            authorizationUrl: `${process.env.API_URL || 'http://localhost:3000'}/api/auth/google`,
            scopes: {
              'email profile': 'Get email and profile info',
            },
          },
        },
      },
      'google-oauth',
    )
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('docs', app, document, {
    swaggerOptions: {
      persistAuthorization: true,
      initOAuth: {
        clientId: process.env.GOOGLE_CLIENT_ID,
        usePkceWithAuthorizationCodeGrant: true,
      },
    },
  });

  await app.listen(process.env.PORT ?? 3000);
}

bootstrap();
