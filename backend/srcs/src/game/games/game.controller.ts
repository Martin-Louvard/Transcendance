import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { GameService } from './game.service';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';

@Controller('game')
@ApiTags('game')
export class GameController {
  constructor(private readonly GameService: GameService) {}

  @Get()
  findAll() {
    return this.GameService.findAll();
  }

  @Get('leaderboard')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  leaderboard(){
    return this.GameService.getLeaderboard();
  }

}
