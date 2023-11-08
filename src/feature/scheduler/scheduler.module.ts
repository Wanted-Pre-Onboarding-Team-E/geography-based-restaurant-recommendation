import { Module } from '@nestjs/common';
import { RestaurantModule } from '../restaurant/restaurant.module';
import { SchedulerService } from './scheduler.service';
import { ExternalApiModule } from '../externalApi/externalApi.module';
import { NotificationModule } from 'src/notification/notification.module';

@Module({
  imports: [RestaurantModule, ExternalApiModule, NotificationModule],
  providers: [SchedulerService],
})
export class SchedulerModule {}
