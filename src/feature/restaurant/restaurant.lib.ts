import { Injectable } from '@nestjs/common';
import { Restaurant } from 'src/entity/restaurant.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class RestaurantLib {
  constructor(
    @InjectRepository(Restaurant)
    private readonly restaurantRepository: Repository<Restaurant>,
  ) {}

  /**
   * 사용자 현재 위치에서 반경 500m 이내 총 평점 3.0 이상의 랜덤 맛집 1개 조회
   * @param userLatitude 사용자 위도
   * @param userLongitude 사용자 경도
   */
  getHighTotalRatingRestaurantNearUser(
    userLatitude: number,
    userLongitude: number,
  ): Promise<Restaurant> {
    return (
      this.restaurantRepository
        .createQueryBuilder('r')
        .select(['r.id', 'r.placeName', 'r.businessType', 'r.roadNameAddress'])
        // NOTE: 하버사인 공식 사용
        .addSelect(
          '6371 * ACOS(' +
            'COS(RADIANS(:userLatitude)) ' +
            '* COS(RADIANS(r.latitude)) ' +
            '* COS(RADIANS(r.longitude) - RADIANS(:userLongitude)) ' +
            '+ SIN(RADIANS(:userLatitude)) * SIN(RADIANS(r.latitude))' +
            ')',
          'distance',
        )
        .setParameter('userLatitude', userLatitude)
        .setParameter('userLongitude', userLongitude)
        .where('r.totalRating >= 3.0')
        .having('distance <= 0.5')
        .orderBy('RAND()')
        .limit(1)
        .getOne()
    );
  }

  async updateRestaurants(restaurants: Restaurant[]): Promise<void> {
    await this.restaurantRepository.upsert(restaurants, ['roadNameAddress']);
  }

  async getRestaurantById(restaurantId: number): Promise<Restaurant> {
    return await this.restaurantRepository.findOneBy({ id: restaurantId });
  }

  async updateTotalRatingByRestaurantId(
    avgRating,
    restaurantId,
  ): Promise<void> {
    await this.restaurantRepository
      .createQueryBuilder()
      .update(Restaurant)
      .set({ totalRating: avgRating })
      .where('id = :restaurantId', { restaurantId })
      .execute();
  }
}
