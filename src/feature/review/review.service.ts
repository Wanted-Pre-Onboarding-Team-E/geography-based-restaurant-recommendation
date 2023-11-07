import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Review } from 'src/entity/review.entity';
import { CreateReviewDto } from '../restaurant/dto/createReview.dto';
import { RestaurantService } from '../restaurant/restaurant.service';
import { FailType } from 'src/enum/failType.enum';
import { RestaurantLib } from '../restaurant/restaurant.lib';

@Injectable()
export class ReviewService {
  constructor(
    @InjectRepository(Review)
    private readonly reviewRepository: Repository<Review>,
    private readonly restaurantLib: RestaurantLib,
  ) {}

  async postReviewOfRestaurantById(
    userId: number,
    restaurantId: number,
    createReviewDto: CreateReviewDto,
  ): Promise<void> {
    const restaurant = await this.restaurantLib.getRestaurantById(restaurantId);

    if (!restaurant) {
      throw new NotFoundException(FailType.RESTAURANT_NOT_FOUND);
    }

    await this.saveReview(userId, restaurantId, createReviewDto);

    const reviews = await this.getReviewsByRestaurantId(restaurantId);

    const avgRating = await this.averageRating(reviews);

    await this.restaurantLib.updateTotalRatingByRestaurantId(avgRating, restaurantId);
  }

  private async saveReview(
    userId: number,
    restaurantId: number,
    createReviewDto: CreateReviewDto,
  ): Promise<void> {
    await this.reviewRepository.save({
      user: { id: userId },
      restaurant: { id: restaurantId },
      rating: createReviewDto.rating,
      content: createReviewDto.content,
    });
  }

  private async getReviewsByRestaurantId(
    restaurantId: number,
  ): Promise<Review[]> {
    return await this.reviewRepository
      .createQueryBuilder('review')
      .innerJoin('review.restaurant', 'restaurant')
      .where('restaurant.id = :restaurantId', { restaurantId })
      .getMany();
  }

  private async averageRating(reviews: Review[]): Promise<number> {
    if (reviews.length === 0) {
      return 0;
    }
    const totalRating = reviews.reduce(
      (total, review) => total + review.rating,
      0,
    );
    const avgRating = totalRating / reviews.length;
    return avgRating;
  }
}
