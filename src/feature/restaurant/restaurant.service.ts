import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';
import { Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { MoreThan, Repository } from 'typeorm';
import { Restaurant } from '../../entity/restaurant.entity';
import { UtilService } from '../../util/util.service';
import { GetRestaurantsDto } from './dto/getRestaurant.dto';

@Injectable()
export class RestaurantService {
  constructor(
    @InjectRepository(Restaurant)
    private readonly restaurantRepository: Repository<Restaurant>,
    private readonly utilService: UtilService,
    @Inject(CACHE_MANAGER)
    private cacheManager: Cache,
  ) {}

  /** 맛집 조회
   * @Query lat 위도
   * @Query lon 경도
   * @Query range 거리
   * @Query sortBy 정렬 종류
   * @Query orderBy 정렬 방식
   * @Query search 검색어
   * @Query pageCount 페이지 당 개수
   * @Query page 페이지 */
  async getRestaurants(
    lat: number,
    lon: number,
    { range, sortBy, orderBy, search, pageCount, page }: GetRestaurantsDto,
  ) {
    return await this.restaurantRepository
      .createQueryBuilder('r')
      .select(`r.id`, `id`)
      .addSelect(`r.placeName`, `placeName`)
      .addSelect(`r.business_type`, `business_type`)
      .addSelect(`r.business_state`, `business_state`)
      .addSelect(`r.road_name_address`, `road_name_address`)
      .addSelect(`r.city_name`, `city_name`)
      .addSelect(`r.latitude`, `latitude`)
      .addSelect(`r.longitude`, `longitude`)
      .addSelect(`r.view_count`, `view_count`)
      .addSelect(`r.total_rating`, `total_rating`)
      .where(`r.placeName LIKE :placeName`, {
        placeName: `%${search}%`,
      })
      .getRawMany()
      .then((result: any[]) => {
        // NOTE: 거리 조건에 대한 filter 진행 후 거리순 대한 정렬 작업
        const startIndex = (page - 1) * pageCount;
        return result
          .filter((item) => {
            return (
              this.utilService.latLonToKm(
                [item.latitude, item.longitude],
                [lat, lon],
              ) < range
            );
          })
          .map((item) => {
            return {
              ...item,
              distance: this.utilService.latLonToKm(
                [item.latitude, item.longitude],
                [lat, lon],
              ),
            };
          })
          .sort((a, b) =>
            orderBy === 'DESC'
              ? b[`${sortBy}`] - a[`${sortBy}`]
              : a[`${sortBy}`] - b[`${sortBy}`],
          )
          .slice(startIndex, startIndex + pageCount);
      });
  }

  async addRestaurantViewCountById(id: number): Promise<any> {
    return await this.restaurantRepository
      .createQueryBuilder()
      .update(Restaurant)
      .set({ viewCount: () => 'viewCount + 1' })
      .where('id = :id', { id })
      .execute();
  }

  async getRestaurantDetailById(id: number): Promise<Restaurant> {
    const { viewCount } = await this.getUpdatedViewCount(id);

    const cachedRestaurant = await this.cacheManager.get(`restaurant:${id}`);

    if (cachedRestaurant) {
      const { data, cachedAt } = JSON.parse(cachedRestaurant as string);
      const updatedRestaurant = await this.mergeCachedAndLatestData(
        id,
        data,
        cachedAt,
      );
      if (updatedRestaurant) {
        updatedRestaurant.viewCount = viewCount;
        return updatedRestaurant;
      } else {
        data.viewCount = viewCount;
        return data;
      }
    }

    const restaurant = await this.restaurantRepository
      .createQueryBuilder('restaurant')
      .leftJoinAndSelect('restaurant.reviews', 'review')
      .leftJoinAndSelect('review.user', 'user')
      .select([
        'restaurant.id',
        'restaurant.placeName',
        'restaurant.businessType',
        'restaurant.businessState',
        'restaurant.roadNameAddress',
        'restaurant.cityName',
        'restaurant.latitude',
        'restaurant.longitude',
        'restaurant.viewCount',
        'restaurant.totalRating',
        'review.id',
        'review.rating',
        'review.content',
        'review.createdAt',
        'user.id',
        'user.username',
      ])
      .where('restaurant.id = :id', { id })
      .orderBy('review.createdAt', 'DESC')
      .getOne();

    if (viewCount >= 100) {
      const currentTime = new Date();
      const koreaTime = new Date(currentTime.getTime() + 9 * 60 * 60 * 1000);
      const { viewCount, ...rest } = restaurant;
      void viewCount; //viewCount 사용하지 않겠다고 선언
      await this.cacheManager.set(
        `restaurant:${id}`,
        JSON.stringify({
          data: rest,
          cachedAt: koreaTime.toISOString(),
        }),
        { ttl: 600 },
      );
    }

    return restaurant;
  }

  async mergeCachedAndLatestData(
    id: number,
    cachedData: Restaurant,
    cachedAt: Date,
  ): Promise<Restaurant> {
    const restaurantWithLatestReviews = await this.restaurantRepository.findOne(
      {
        where: {
          id,
          reviews: {
            createdAt: MoreThan(cachedAt),
          },
        },
        select: {
          id: true,
          reviews: {
            id: true,
            rating: true,
            content: true,
            createdAt: true,
            user: {
              id: true,
              username: true,
            },
          },
        },
        relations: {
          reviews: {
            user: true,
          },
        },
        order: {
          reviews: { createdAt: 'desc' },
        },
      },
    );

    if (!restaurantWithLatestReviews) {
      return;
    }

    const latestReviews = restaurantWithLatestReviews.reviews;

    const mergedReviews = [...latestReviews, ...cachedData.reviews];

    const updatedRestaurant = { ...cachedData, reviews: mergedReviews };

    const currentTime = new Date();
    const koreaTime = new Date(currentTime.getTime() + 9 * 60 * 60 * 1000);
    await this.cacheManager.set(
      `restaurant:${id}`,
      JSON.stringify({
        data: updatedRestaurant,
        cachedAt: koreaTime.toISOString(),
      }),
      { ttl: 600 },
    );
    return updatedRestaurant;
  }

  async getUpdatedViewCount(id: number): Promise<Restaurant> {
    return await this.restaurantRepository.findOne({
      where: {
        id,
      },
      select: {
        viewCount: true,
      },
    });
  }
}
