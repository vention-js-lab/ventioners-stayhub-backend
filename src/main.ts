import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { EnvConfig, ValidationConfig } from './shared/configs';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.setGlobalPrefix('api');

  const configService = app.get(ConfigService<EnvConfig>);

  app.useGlobalPipes(ValidationConfig);

  const port = configService.getOrThrow('APP_PORT', {
    infer: true,
  });

  const config = new DocumentBuilder()
    .setTitle('Stayhub API')
    .setDescription('The Stayhub API description')
    .setVersion('1.0')
    .addTag('stayhub')
    .build();
  const documentFactory = () => SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, documentFactory);

  await app.listen(port);
}
bootstrap();
