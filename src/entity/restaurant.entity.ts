import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  Unique,
  UpdateDateColumn,
} from 'typeorm';
import { BusinessType } from '../enum/businessType.enum';

@Entity('restaurants')
@Unique('UQ_PLACE_NAME_ROAD_NAME_ADDRESS', ['placeName', 'roadNameAddress']) // 다중컬럼 유니크 제약조건
export class Restaurant {
  @PrimaryGeneratedColumn()
  id!: number;

  // NOTE: 양방향 필요해지면 추가해주세요.
  // @OneToMany(() => Review, (review) => review.restaurant)
  // reviews: Review[];

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

  @Column() // 위도
  latitude!: number;

  @Column() // 경도
  longitude!: number;

  @Column({ default: 0 }) // 조회수
  viewCount!: number;

  @Column({ default: 0.0 }) // 총평점
  totalRating!: number;

  @Column({ nullable: true }) // 인허가일자
  licenseDate?: Date;

  @Column({ nullable: true }) // 폐업일자
  closeDate?: Date;

  @Column({ nullable: true, type: 'varchar', length: 50 }) // 소재지면
  locationArea?: string;

  @Column({ nullable: true, type: 'varchar', length: 255 }) // 급수시설구분명
  waterworksName?: string;

  @Column({ nullable: true }) // 남성종사자수
  maleEmployeeCount?: number;

  @Column({ nullable: true }) // 여성종사자수
  femaleEmployeeCount?: number;

  @Column({ nullable: true, type: 'varchar', length: 20 }) // 연도
  year?: string;

  @Column({ nullable: true }) // 다중이용업소여부
  isMultiUse?: boolean;

  @Column({ nullable: true, type: 'varchar', length: 100 }) // 등급구분명
  gradeName?: string;

  @Column({ nullable: true, type: 'varchar', length: 100 }) // 총시설규모
  totalFacilityScale?: string;

  @Column({ nullable: true, type: 'varchar', length: 100 }) // 영업장주변구분명
  surroundingAreaName?: string;

  @Column({ nullable: true, type: 'varchar', length: 100 }) // 위생업종명
  industryType?: string;

  @Column({ nullable: true }) // 총종업원수
  totalEmployeeCount?: string;

  @Column({ nullable: true, type: 'varchar', length: 200 }) // 소재지지번주소
  lotNumberAddress?: string;

  @Column({ nullable: true, type: 'varchar', length: 30 }) // 우편번호
  zipCode?: string;

  @Column({ nullable: true }) // 시군코드
  cityCode?: number;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn({ nullable: true })
  updatedAt?: Date;
}
