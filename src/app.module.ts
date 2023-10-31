import { Module } from '@nestjs/common';
import { AuthModule } from './feature/auth/auth.module';
import { UserModule } from './feature/user/user.module';
import { RestaurantModule } from './feature/restaurant/restaurant.module';

@Module({
  imports: [AuthModule, UserModule, RestaurantModule],
  providers: [],
})
export class AppModule {}
