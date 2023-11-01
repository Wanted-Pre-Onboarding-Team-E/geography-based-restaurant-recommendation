import { Module } from '@nestjs/common';
import { RestaurantService } from './restaurant.service';
import { RestaurantController } from './restaurant.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Restaurant } from 'src/entity/restaurant.entity';
import { ReviewService } from './review.service';
import { Review } from 'src/entity/review.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Restaurant, Review])],
  controllers: [RestaurantController],
  providers: [RestaurantService, ReviewService],
})
export class RestaurantModule {}
