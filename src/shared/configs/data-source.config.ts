import { DataSource, DataSourceOptions } from 'typeorm';
import { ConfigService } from '@nestjs/config';
import { config } from 'dotenv';
import { isProd } from '../helpers';
config();

const configService = new ConfigService();
const isProduction = isProd(configService.get('NODE_ENV'));

export const dataSourceConfig: DataSourceOptions = {
  type: 'postgres',
  host: configService.get('DB_HOST'),
  port: configService.get<number>('DB_PORT'),
  username: configService.get('DB_USER'),
  password: configService.get('DB_PASSWORD'),
  database: configService.get('DB_NAME'),
  entities: [
    isProduction
      ? 'dist/modules/**/entities/*.entity.js'
      : 'src/modules/**/entities/*.entity.ts',
  ],
  migrations: [
    isProduction
      ? 'dist/database/migrations/*.js'
      : 'src/database/migrations/*.ts',
  ],
  ssl: isProduction,
  ...(isProduction && {
    extra: {
      ssl: {
        rejectUnauthorized: false,
      },
    },
  }),
};

export const dataSource = new DataSource(dataSourceConfig);
