import { Module } from '@nestjs/common';
import { CityService } from './city.service';
import { CityController } from './city.controller';
import { CacheModule } from '@nestjs/cache-manager';
import * as redisStore from 'cache-manager-ioredis';

@Module({
  imports: [
    CacheModule.register({
      isGlobal: true,
      store: redisStore,
      host: 'localhost',
      port: 6379,
      ttl: 100000,
    }),
  ],
  controllers: [CityController],
  providers: [CityService],
})
export class CityModule {}
