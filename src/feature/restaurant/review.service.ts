import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Review } from 'src/entity/review.entity';
import { Repository } from 'typeorm';
import { CreateReviewDto } from './dto/CreateReviewDto';

@Injectable()
export class ReviewService {
  constructor(
    @InjectRepository(Review)
    private readonly reviewRepository: Repository<Review>,
  ) {}

  async createReview(
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

  async find(restaurantId: number): Promise<Review[]> {
    return await this.reviewRepository
      .createQueryBuilder('review')
      .innerJoin('review.restaurant', 'restaurant')
      .where('restaurant.id = :restaurantId', { restaurantId })
      .getMany();
  }
}
