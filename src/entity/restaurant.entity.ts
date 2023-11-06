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
@Unique(['roadNameAddress'])
export class Restaurant {
  @PrimaryGeneratedColumn()
  id!: number;

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

  @Column({ type: 'double' })
  latitude!: number; // 위도

  @Column({ type: 'double' })
  longitude!: number; // 경도

  @Column({ default: 0 })
  viewCount!: number; // 조회수

  @Column({ type: 'double', default: 0.0 })
  totalRating!: number; // 총평점

  @Column({ type: 'varchar', length: 100 })
  licenseDate!: string; // 인허가일자

  @Column({ type: 'varchar', length: 50 })
  closeDate!: string; // 폐업일자

  @Column({ type: 'varchar', length: 50 })
  locationArea!: string; // 소재지면

  @Column({ type: 'varchar', length: 255 })
  waterworksName!: string; // 급수시설구분명

  @Column()
  maleEmployeeCount!: number; // 남성종사자수

  @Column()
  femaleEmployeeCount!: number; // 여성종사자수

  @Column({ type: 'varchar', length: 20 })
  year!: string; // 연도

  @Column({ type: 'varchar', length: 100 })
  isMultiUse!: string; // 다중이용업소여부

  @Column({ type: 'varchar', length: 100 })
  gradeName!: string; // 등급구분명

  @Column({ type: 'varchar', length: 100 })
  totalFacilityScale!: string; // 총시설규모

  @Column({ type: 'varchar', length: 100 })
  surroundingAreaName!: string; // 영업장주변구분명

  @Column({ type: 'varchar', length: 100 })
  industryType!: string; // 위생업종명

  @Column()
  totalEmployeeCount!: string; // 총종업원수

  @Column({ type: 'varchar', length: 200 })
  lotNumberAddress!: string; // 소재지지번주소

  @Column({ type: 'varchar', length: 30 })
  zipCode!: string; // 우편번호

  @Column({ type: 'varchar', length: 50 })
  cityCode!: string; // 시군코드

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt?: Date | null;
}
