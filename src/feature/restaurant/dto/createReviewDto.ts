import {
  IsString,
  IsNumber,
  IsNotEmpty,
  Min,
  Max,
  IsInt,
  IsOptional,
} from 'class-validator';

export class CreateReviewDto {
  @IsNumber()
  @IsNotEmpty()
  @IsInt()
  @Min(0)
  @Max(5)
  rating!: number;

  @IsString()
  @IsOptional()
  content?: string;
}
