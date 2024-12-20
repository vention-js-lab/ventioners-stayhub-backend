import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { SwaggerModule } from '@nestjs/swagger';
import { EnvConfig, ValidationConfig } from './shared/configs';
import cookieParser from 'cookie-parser';
import { swaggerConfig } from './shared/configs/swagger.config';
import bodyParser from 'body-parser';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const configService = app.get(ConfigService<EnvConfig>);

  app.useGlobalPipes(ValidationConfig);
  app.use(cookieParser());
  app.use('/stripe/webhook', bodyParser.raw({ type: '*/*' }));

  app.enableCors({
    origin: configService.get('ALLOWED_ORIGINS'),
    credentials: true,
  });

  const port = configService.getOrThrow('APP_PORT', {
    infer: true,
  });

  const documentFactory = () =>
    SwaggerModule.createDocument(app, swaggerConfig);

  SwaggerModule.setup('docs', app, documentFactory);

  await app.listen(port);
}

bootstrap();
