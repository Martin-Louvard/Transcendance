import { Module } from '@nestjs/common';
import { PrismaModule } from 'src/prisma/prisma.module';
import { GameService } from './game.service';
import { GameController } from './game.controller';


@Module({
  controllers: [GameController],
  providers: [GameService ],
  imports: [PrismaModule],
  exports: [GameService],
})
export class GameModule {}
