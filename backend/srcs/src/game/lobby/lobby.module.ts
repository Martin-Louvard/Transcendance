import { Module } from '@nestjs/common';
import { LobbyService } from './lobby.service';
import { ScheduleModule } from '@nestjs/schedule';

@Module({
	imports: [ScheduleModule.forRoot()],
	providers: [LobbyService],
	exports: [LobbyService],
})
export class LobbyModule {}
