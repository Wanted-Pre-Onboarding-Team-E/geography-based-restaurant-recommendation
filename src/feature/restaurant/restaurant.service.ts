import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Restaurant } from 'src/entity/restaurant.entity';
import { Repository } from 'typeorm';
import { CreateReviewDto } from './dto/CreateReviewDto';
import { ReviewService } from './review.service';

@Injectable()
export class RestaurantService {
  constructor(
    @InjectRepository(Restaurant)
    private readonly restaurantRepository: Repository<Restaurant>,
    private readonly reviewService: ReviewService,
  ) {}

  async postReviewOfRestaurantById(
    userId: number,
    restaurantId: number,
    createReviewDto: CreateReviewDto,
  ): Promise<void> {
    const restaurant = await this.restaurantRepository.findOneBy({
      id: restaurantId,
    });
    if (!restaurant) {
      throw new NotFoundException('음식점을 찾을 수 없습니다.');
    }

    const createReview = await this.reviewService.createReview(
      userId,
      restaurantId,
      createReviewDto,
    );

    const reviews = await this.reviewService.find(restaurantId);

    const totalRating = reviews.reduce(
      (total, review) => total + review.rating,
      0,
    );

    const avgRating = totalRating / reviews.length;
    restaurant.totalRating = avgRating;

    await this.restaurantRepository
      .createQueryBuilder()
      .update(Restaurant)
      .set({ totalRating: avgRating })
      .where('id = :restaurantId', { restaurantId })
      .execute();

    return createReview;
  }
}
