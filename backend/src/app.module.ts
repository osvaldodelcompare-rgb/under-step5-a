import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { APP_FILTER, APP_GUARD, APP_INTERCEPTOR } from '@nestjs/core';
import configuration from '@config/configuration';
import { getTypeOrmConfig } from '@config/database.config';
import { JwtAuthGuard } from '@modules/auth/guards/jwt-auth.guard';
import { HttpExceptionFilter } from '@shared/filters/http-exception.filter';
import { TransformInterceptor } from '@shared/interceptors/transform.interceptor';

import { AuthModule } from '@modules/auth/auth.module';
import { UsersModule } from '@modules/users/users.module';
import { RegionsModule } from '@modules/regions/regions.module';
import { VenuesModule } from '@modules/venues/venues.module';
import { BandsModule } from '@modules/bands/bands.module';
import { PostsModule } from '@modules/posts/posts.module';
import { NotificationsModule } from '@modules/notifications/notifications.module';
import { UploadsModule } from '@modules/uploads/uploads.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [configuration],
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: getTypeOrmConfig,
    }),
    AuthModule,
    UsersModule,
    RegionsModule,
    VenuesModule,
    BandsModule,
    PostsModule,
    NotificationsModule,
    UploadsModule,
  ],
  providers: [
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
    {
      provide: APP_FILTER,
      useClass: HttpExceptionFilter,
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: TransformInterceptor,
    },
  ],
})
export class AppModule {}
