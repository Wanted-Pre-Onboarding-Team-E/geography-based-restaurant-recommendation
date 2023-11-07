import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, UpdateResult } from 'typeorm';
import { User } from '../../entity/user.entity';
import { UpdateUserLocationDto } from './dto/updateUserLocation.dto';

@Injectable()
export class UserLib {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  /**
   * id로 사용자 조회
   * @param id 사용자 DB ID
   * @return User 객체
   */
  getUserById(id: number): Promise<User> {
    return this.userRepository.findOneBy({ id });
  }

  /**
   * id의 사용자 점심 추천 여부 업데이트
   * @param id 사용자 DB ID
   * @param isRecommended 사용자 점심 추천 여부
   * @return User 객체
   */
  updateUserRecommendation(
    id: number,
    isRecommended: boolean,
  ): Promise<UpdateResult> {
    return this.userRepository.update(id, {
      isRecommended,
    });
  }

  updateUserLocation(id: number, updateUserLocationDto: UpdateUserLocationDto) {
    return this.userRepository.update(id, updateUserLocationDto);
  }

  getUsersUsingRecommendation() {
    return this.userRepository.findBy({ isRecommended: true });
  }
}
