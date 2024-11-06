import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { config } from 'dotenv';

config();

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST,
      port: +parseInt(process.env.DB_PORT, 10),
      username: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      entities: [], // Add your entities here
      synchronize: true,
    }),
    TypeOrmModule.forFeature([]), // Add your ennities here to be able to use them in your services
  ],
  exports: [TypeOrmModule],
})
export class DatabaseModule {}
