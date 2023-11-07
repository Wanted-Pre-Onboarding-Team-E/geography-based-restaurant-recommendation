import { IsNumber } from 'class-validator';

export class UpdateUserLocationDto {
  @IsNumber()
  latitude?: number;

  @IsNumber()
  longitude?: number;
}
