import { DocumentBuilder } from '@nestjs/swagger';

export const swaggerConfig = new DocumentBuilder()
  .setTitle('Stayhub API')
  .setDescription('The Stayhub API description')
  .setVersion('1.0')
  .addTag('stayhub')
  .addSecurity('cookie-auth', {
    type: 'apiKey',
    in: 'cookie',
    name: 'accessToken',
  })
  .build();
