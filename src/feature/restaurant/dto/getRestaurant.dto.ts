import { IsEnum, IsOptional, IsString } from 'class-validator';

export class GetRestaurantsDto {
  @IsString()
  range!: number;

  // 정렬 요소
  @IsEnum(['distance', 'total_rating'])
  @IsOptional()
  sortBy?: 'distance' | 'total_rating' = 'distance';

  // 정렬 방식
  @IsEnum(['ASC', 'DESC'])
  @IsOptional()
  orderBy?: 'ASC' | 'DESC' = 'ASC';

  @IsString()
  @IsOptional()
  search?: string = '';

  @IsString()
  @IsOptional()
  pageCount?: number = 10;

  @IsString()
  @IsOptional()
  page?: number = 1;
}
