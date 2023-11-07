import { IsBoolean } from 'class-validator';
import { FailType } from '../../../enum/failType.enum';

export class UpdateUserDto {
  @IsBoolean({ message: FailType.RECOMMENDATION_NOT_BOOLEAN })
  isRecommended!: boolean;
}
