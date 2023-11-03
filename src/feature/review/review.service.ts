import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ErrorMessage } from '../error/error.enum';
import { Review } from 'src/entity/review.entity';
import { CreateReviewDto } from '../restaurant/dto/CreateReviewDto';
import { RestaurantService } from '../restaurant/restaurant.service';

@Injectable()
export class ReviewService {
  constructor(
    @InjectRepository(Review)
    private readonly reviewRepository: Repository<Review>,
    private readonly restaurantService: RestaurantService,
  ) {}

  async postReviewOfRestaurantById(
    userId: number,
    restaurantId: number,
    createReviewDto: CreateReviewDto,
  ): Promise<void> {
    const restaurant = await this.restaurantService.findOneBy(restaurantId);

    if (!restaurant) {
      throw new NotFoundException(ErrorMessage.RESTAURANT_NOTFOUND);
    }

    await this.reviewRepository.save({
      user: { id: userId },
      restaurant: { id: restaurantId },
      rating: createReviewDto.rating,
      content: createReviewDto.content,
    });

    const reviews = await this.reviewRepository
      .createQueryBuilder('review')
      .innerJoin('review.restaurant', 'restaurant')
      .where('restaurant.id = :restaurantId', { restaurantId })
      .getMany();

    const totalRating = reviews.reduce(
      (total, review) => total + review.rating,
      0,
    );

    const avgRating = totalRating / reviews.length;
    restaurant.totalRating = avgRating;

    await this.restaurantService.updateRestaurant(avgRating, restaurantId);
  }
}
