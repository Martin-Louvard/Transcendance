import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { PrismaModule } from 'src/prisma/prisma.module';
import { TwoFactorAuthenticationController } from './twoFAauth.controller';


@Module({
  controllers: [UsersController, TwoFactorAuthenticationController],
  providers: [UsersService],
  imports: [PrismaModule],
  exports: [UsersService]
})
export class UsersModule {}
