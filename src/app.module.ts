import { Module } from '@nestjs/common';
import { AuthModule } from './feature/auth/auth.module';
import { UserModule } from './feature/user/user.module';

@Module({
  imports: [AuthModule, UserModule],
  providers: [],
})
export class AppModule {}
