import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { EnvConfig, ValidationConfig } from './shared/configs';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.setGlobalPrefix('api');

  const configService = app.get(ConfigService<EnvConfig>);

  app.useGlobalPipes(ValidationConfig);

  const port = configService.getOrThrow('APP_PORT', {
    infer: true,
  });

  await app.listen(port);
}
bootstrap();
