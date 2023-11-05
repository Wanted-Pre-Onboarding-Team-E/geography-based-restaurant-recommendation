import { Module } from '@nestjs/common';
import { RestaurantService } from './restaurant.service';
import { RestaurantController } from './restaurant.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Restaurant } from 'src/entity/restaurant.entity';
import { RestaurantLib } from './restaurant.lib';
import { SchedulerService } from '../scheduler/scheduler.service';
import { ExternalApiModule } from '../externalApi/externalApi.module';

@Module({
  imports: [TypeOrmModule.forFeature([Restaurant])],
  controllers: [RestaurantController],
  providers: [RestaurantService, RestaurantLib],
  exports: [RestaurantLib],
})
export class RestaurantModule {}
