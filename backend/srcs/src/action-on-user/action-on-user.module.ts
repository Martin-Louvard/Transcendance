import { Module } from '@nestjs/common';
import { ActionOnUserService } from './action-on-user.service';
import { ActionOnUserController } from './action-on-user.controller';
import { PrismaModule } from 'src/prisma/prisma.module';

@Module({
  controllers: [ActionOnUserController],
  providers: [ActionOnUserService],
  imports: [PrismaModule],
  exports: [ActionOnUserService],
})
export class ActionOnUserModule {}
