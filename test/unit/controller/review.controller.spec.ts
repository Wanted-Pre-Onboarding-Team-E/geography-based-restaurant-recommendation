import { Test, TestingModule } from '@nestjs/testing';
import { ReviewController } from 'src/feature/review/review.controller';
import { ReviewService } from 'src/feature/review/review.service';
import { SuccessType } from 'src/enum/successType.enum';
import { CreateReviewDto } from 'src/feature/restaurant/dto/createReview.dto';

const reviewService = {
  postReviewOfRestaurantById: jest.fn(),
};

describe('ReviewController', () => {
  let controller: ReviewController;
  const mockUser = { id: 123, username: 'testuser' };
  const mockReq = { user: mockUser }; // 모의(Mock) req 객체
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ReviewController],
      providers: [
        {
          provide: ReviewService,
          useValue: reviewService, // Mocked ReviewService
        },
      ],
    }).compile();

    controller = module.get<ReviewController>(ReviewController);
  });

  it('평가 추가 컨트롤러', async () => {
    const userId = 123;
    const restaurantId = 2;
    const createReviewDto: CreateReviewDto = {
      rating: 1,
      content: '오',
    };

    const result = await controller.postReviewOfRestaurantById(
      mockReq,
      restaurantId,
      createReviewDto,
    );

    expect(result).toBeDefined();
    expect(result.message).toBe(SuccessType.REVIEW_SAVE); // Assuming this is the expected message
    expect(reviewService.postReviewOfRestaurantById).toHaveBeenCalledWith(
      userId,
      restaurantId,
      createReviewDto,
    );
  });
});
