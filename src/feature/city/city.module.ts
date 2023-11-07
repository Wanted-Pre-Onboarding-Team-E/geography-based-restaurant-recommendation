import { Module } from '@nestjs/common';
import { CityController } from './city.controller';
import { CityService } from './city.service';
import { ExternalApiModule } from '../externalApi/externalApi.module';

@Module({
  imports: [ExternalApiModule],
  controllers: [CityController],
  providers: [CityService],
})
export class CityModule {}
