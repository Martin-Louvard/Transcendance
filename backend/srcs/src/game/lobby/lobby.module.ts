import { Module } from '@nestjs/common';
import { LobbyService } from './lobby.service';
import { ScheduleModule } from '@nestjs/schedule';
import { PlayerModule } from '../player/player.module';

@Module({
	imports: [ScheduleModule.forRoot(), PlayerModule],
	providers: [LobbyService],
	exports: [LobbyService],
})
export class LobbyModule {}
