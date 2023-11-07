import { Module } from '@nestjs/common';
import { ExternalApiLib } from './externalApi.lib';
import { HttpModule } from '@nestjs/axios';

@Module({
  imports: [
    HttpModule.register({
      timeout: 5000,
      maxRedirects: 5,
    }),
  ],
  providers: [ExternalApiLib],
  exports: [ExternalApiLib],
})
export class ExternalApiModule {}
