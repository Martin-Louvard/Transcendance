import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { GameService } from './game.service';
import { ApiTags } from '@nestjs/swagger';

@Controller('game')
@ApiTags('game')
export class GameController {
  constructor(private readonly GameService: GameService) {}

  @Get()
  findAll() {
    return this.GameService.findAll();
  }

  @Get('leaderboard')
  leaderboard(){
    return this.GameService.getLeaderboard();
  }

}
