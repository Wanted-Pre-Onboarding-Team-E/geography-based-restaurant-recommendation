import { CacheModule } from '@nestjs/cache-manager';
import { Module } from '@nestjs/common';
import * as redisStore from 'cache-manager-ioredis';
import { SchedulerModule } from '../scheduler/scheduler.module';
import { CityController } from './city.controller';
import { CityService } from './city.service';

@Module({
  imports: [
    CacheModule.register({
      isGlobal: true,
      store: redisStore,
      host: 'localhost',
      port: 6379,
      ttl: 100000,
    }),
    SchedulerModule,
  ],
  controllers: [CityController],
  providers: [CityService],
})
export class CityModule {}
