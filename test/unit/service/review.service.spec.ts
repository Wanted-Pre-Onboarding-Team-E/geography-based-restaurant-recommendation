import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Review } from 'src/entity/review.entity';
import { ReviewService } from 'src/feature/review/review.service';
import { RestaurantService } from 'src/feature/restaurant/restaurant.service';
describe('ReviewService', () => {
  let reviewService: ReviewService;

  const restaurantService = {
    findOneBy: jest.fn(),
    updateRestaurant: jest.fn(),
  };

  const reviewRepository = {
    createQueryBuilder: jest.fn().mockReturnValue({
      innerJoin: jest.fn().mockReturnThis(),
      where: jest.fn().mockReturnThis(),
      getMany: jest.fn().mockReturnThis(),
    }),
    save: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ReviewService,
        {
          provide: getRepositoryToken(Review),
          useValue: reviewRepository,
        },
        {
          provide: RestaurantService,
          useValue: restaurantService,
        },
      ],
    }).compile();

    reviewService = module.get<ReviewService>(ReviewService);
  });

  it('리뷰 생성 및 레스토랑 업데이트', async () => {
    const mockRestaurant = { id: 1 };
    restaurantService.findOneBy = jest.fn().mockResolvedValue(mockRestaurant);

    const averageRatingSpy = jest
      .spyOn(reviewService as any, 'averageRating')
      .mockReturnValue(4.5);

    const userId = 1;
    const restaurantId = 1;
    const createReviewDto = {
      rating: 5,
      content: '맛있습니다.',
    };

    await reviewService.postReviewOfRestaurantById(
      userId,
      restaurantId,
      createReviewDto,
    );

    expect(restaurantService.findOneBy).toHaveBeenCalledWith(restaurantId);
    expect(reviewRepository.save).toHaveBeenCalledWith({
      user: { id: userId },
      restaurant: { id: restaurantId },
      rating: createReviewDto.rating,
      content: createReviewDto.content,
    });

    expect(averageRatingSpy).toHaveBeenCalled();
  });
});
