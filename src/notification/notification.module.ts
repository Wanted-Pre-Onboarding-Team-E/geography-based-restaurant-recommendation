import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';

import { UserModule } from '../feature/user/user.module';
import { RestaurantModule } from '../feature/restaurant/restaurant.module';
import { NotificationLib } from './notification.lib';

@Module({
  imports: [HttpModule, UserModule, RestaurantModule],
  providers: [NotificationLib],
  exports: [NotificationLib],
})
export class NotificationModule {}
