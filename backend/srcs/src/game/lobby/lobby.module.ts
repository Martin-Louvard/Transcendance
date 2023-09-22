import { Module } from '@nestjs/common';
import { LobbyService } from './lobby.service';
import { ScheduleModule } from '@nestjs/schedule';
import { PlayerModule } from '../player/player.module';
import { LobbyController } from './lobby.controller';
import { PrismaService } from 'src/prisma/prisma.service';
import { PrismaModule } from 'src/prisma/prisma.module';

@Module({
	imports: [ScheduleModule.forRoot(), PlayerModule, PrismaModule],
	providers: [LobbyService],
	exports: [LobbyService],
	controllers: [LobbyController],
})
export class LobbyModule {}
