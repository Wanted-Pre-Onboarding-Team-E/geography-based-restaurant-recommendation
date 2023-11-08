import { IsNumber } from 'class-validator';
import { FailType } from '../../../enum/failType.enum';

export class UpdateUserLocationDto {
  @IsNumber({}, { message: FailType.LOCATION_NOT_FOUND })
  latitude?: number;

  @IsNumber({}, { message: FailType.LOCATION_NOT_FOUND })
  longitude?: number;
}
