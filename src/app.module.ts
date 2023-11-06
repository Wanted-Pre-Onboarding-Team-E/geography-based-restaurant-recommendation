import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { CacheModule } from '@nestjs/cache-manager';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ScheduleModule } from '@nestjs/schedule';
import { SnakeNamingStrategy } from 'typeorm-naming-strategies';
import * as redisStore from 'cache-manager-ioredis';

import { User } from './entity/user.entity';
import { Restaurant } from './entity/restaurant.entity';
import { Review } from './entity/review.entity';

import { AuthModule } from './feature/auth/auth.module';
import { UserModule } from './feature/user/user.module';
import { RestaurantModule } from './feature/restaurant/restaurant.module';
import { CityModule } from './feature/city/city.module';
import { NotificationModule } from './notification/notification.module';
import { UtilModule } from './util/util.module';
import { ReviewModule } from './feature/review/review.module';

@Module({
  imports: [
    ScheduleModule.forRoot(),
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: `.${process.env.NODE_ENV}.env`,
    }),
    CacheModule.register({
      isGlobal: true,
      store: redisStore,
      host: 'localhost',
      port: 6379,
    }),
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        return {
          type: 'mysql',
          host: 'localhost',
          port: parseInt(configService.get<string>('DB_PORT')),
          username: configService.get<string>('DB_USERNAME'),
          password: configService.get<string>('DB_PASSWORD'),
          database: configService.get<string>('DB_DATABASE'),
          entities: [User, Restaurant, Review],
          synchronize: configService.get<string>('NODE_ENV') === 'local',
          logging: configService.get<string>('NODE_ENV') === 'local',
          namingStrategy: new SnakeNamingStrategy(), // 컬럼명 snake case로 변환
        };
      },
    }),
    AuthModule,
    UserModule,
    RestaurantModule,
    CityModule,
    NotificationModule,
    UtilModule,
    ReviewModule,
  ],
  providers: [],
})
export class AppModule {}
