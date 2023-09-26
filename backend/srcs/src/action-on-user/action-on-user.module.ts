import { Module } from '@nestjs/common';
import { ActionOnUserService } from './action-on-user.service';
import { ActionOnUserController } from './action-on-user.controller';

@Module({
  controllers: [ActionOnUserController],
  providers: [ActionOnUserService],
})
export class ActionOnUserModule {}
