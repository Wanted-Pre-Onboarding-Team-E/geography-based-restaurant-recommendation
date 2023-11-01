import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  Unique,
  UpdateDateColumn,
} from 'typeorm';
import { BusinessType } from '../enum/businessType.enum';
import { Review } from './review.entity';

@Entity('restaurants')
@Unique('UQ_PLACE_NAME_ROAD_NAME_ADDRESS', ['placeName', 'roadNameAddress']) // 다중컬럼 유니크 제약조건
export class Restaurant {
  @PrimaryGeneratedColumn()
  id!: number;

  // NOTE: 양방향 필요해지면 추가해주세요.
  @OneToMany(() => Review, (review) => review.restaurant, { cascade: true })
  reviews: Review[];

  @Column({ type: 'varchar', length: 100 })
  placeName!: string; // 사업장명

  @Column({ type: 'varchar', length: 100 })
  businessType!: BusinessType; // 위생업태명

  @Column()
  businessState!: boolean; // 영업상태명

  @Column({ type: 'varchar', length: 200 })
  roadNameAddress!: string; // 소재지도로명주소

  @Column({ type: 'varchar', length: 100 }) // 시군명
  cityName!: string;

  @Column()
  latitude!: number; // 위도

  @Column()
  longitude!: number; // 경도

  @Column({ default: 0 })
  viewCount!: number; // 조회수

  @Column({ type: 'double', default: 0.0 })
  totalRating!: number; // 총평점

  @Column({ nullable: true })
  licenseDate?: Date; // 인허가일자

  @Column({ nullable: true })
  closeDate?: Date; // 폐업일자

  @Column({ nullable: true, type: 'varchar', length: 50 })
  locationArea?: string; // 소재지면

  @Column({ nullable: true, type: 'varchar', length: 255 })
  waterworksName?: string; // 급수시설구분명

  @Column({ nullable: true })
  maleEmployeeCount?: number; // 남성종사자수

  @Column({ nullable: true })
  femaleEmployeeCount?: number; // 여성종사자수

  @Column({ nullable: true, type: 'varchar', length: 20 })
  year?: string; // 연도

  @Column({ nullable: true })
  isMultiUse?: boolean; // 다중이용업소여부

  @Column({ nullable: true, type: 'varchar', length: 100 })
  gradeName?: string; // 등급구분명

  @Column({ nullable: true, type: 'varchar', length: 100 })
  totalFacilityScale?: string; // 총시설규모

  @Column({ nullable: true, type: 'varchar', length: 100 })
  surroundingAreaName?: string; // 영업장주변구분명

  @Column({ nullable: true, type: 'varchar', length: 100 })
  industryType?: string; // 위생업종명

  @Column({ nullable: true })
  totalEmployeeCount?: string; // 총종업원수

  @Column({ nullable: true, type: 'varchar', length: 200 })
  lotNumberAddress?: string; // 소재지지번주소

  @Column({ nullable: true, type: 'varchar', length: 30 })
  zipCode?: string; // 우편번호

  @Column({ nullable: true })
  cityCode?: number; // 시군코드

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn({ nullable: true })
  updatedAt?: Date;
}
