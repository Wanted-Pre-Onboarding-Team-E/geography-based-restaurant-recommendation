import { Module } from '@nestjs/common';
import { RestaurantModule } from '../restaurant/restaurant.module';
import { SchedulerService } from './scheduler.service';
import { ExternalApiModule } from '../externalApi/externalApi.module';

@Module({
  imports: [RestaurantModule, ExternalApiModule],
  providers: [SchedulerService],
  exports: [SchedulerService],
})
export class SchedulerModule {}
