import { Module } from '@nestjs/common';
import { AuthModule } from './feature/auth/auth.module';

@Module({
  imports: [AuthModule],
  providers: [],
})
export class AppModule {}
