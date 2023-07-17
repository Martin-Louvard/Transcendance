import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { ArticleModule } from './article/article.module';
import { GameController } from './game/game.controller';
import { GameService } from './game/game.service';

@Module({
  imports: [PrismaModule, ArticleModule],
  controllers: [AppController, GameController],
  providers: [AppService, GameService],
})
export class AppModule {}
