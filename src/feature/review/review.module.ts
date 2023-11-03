import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ReviewController } from './review.controller';
import { ReviewService } from './review.service';
import { Review } from 'src/entity/review.entity';
import { RestaurantModule } from '../restaurant/restaurant.module';

@Module({
  imports: [TypeOrmModule.forFeature([Review]), RestaurantModule],
  controllers: [ReviewController],
  providers: [ReviewService],
})
export class ReviewModule {}
