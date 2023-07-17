import { Controller, Get } from '@nestjs/common';
import { GameService } from './game.service';

@Controller('game')
export class GameController {
	gameService: GameService;
	constructor(gameService: GameService ) {
		this.gameService = gameService;
	}
	
	@Get()
	StartGame() {
		return this.gameService.StartGame();
	}
}
