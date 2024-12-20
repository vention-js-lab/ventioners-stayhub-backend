import { Module } from '@nestjs/common';
import { DatabaseModule } from '@database';
import { RedisModule } from './redis/redis.module';
import { ConfigModule } from '@nestjs/config';
import { validateEnv } from './shared/configs';
import { UsersModule } from './modules/users/users.module';
import { AuthModule } from './modules/auth/auth.module';
import { AccommodationsModule } from './modules/accommodations/accommodations.module';
import { CategoriesModule } from './modules/categories/categories.module';
import { AmenitiesModule } from './modules/amenities/amenities.module';
import { MinioModule } from './modules/minio/minio.module';
import { BookingsModule } from './modules/bookings/bookings.module';
import { OAuthModule } from './modules/oAuth';
import { ReviewsModule } from './modules/reviews/reviews.module';
import { MailModule } from './modules/mail/mail.module';
import { StripeModule } from './modules/stripe/stripe.module';
import { PaymentsModule } from './modules/payments/payments.module';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { NotificationModule } from './modules/notifications/notificaton.module';
import { ScheduleModule } from '@nestjs/schedule';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
      validate: validateEnv,
    }),
    EventEmitterModule.forRoot(),
    DatabaseModule,
    RedisModule,
    ScheduleModule.forRoot(),
    UsersModule,
    AuthModule,
    OAuthModule,
    AccommodationsModule,
    CategoriesModule,
    AmenitiesModule,
    MinioModule,
    BookingsModule,
    StripeModule,
    PaymentsModule,
    ReviewsModule,
    MailModule,
    PaymentsModule,
    NotificationModule,
  ],
})
export class AppModule {}
