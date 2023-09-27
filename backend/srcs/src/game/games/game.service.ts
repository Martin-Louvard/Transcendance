import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class GameService {
  constructor(private prisma: PrismaService) {}

  findAll() {
    return this.prisma.game.findMany();
  }

  async getLeaderboard(){
    const users = await this.prisma.user.findMany({});
    const sortedUsers = users.sort((a, b) => b.victoriesCount - a.victoriesCount);
    return (sortedUsers.slice(0, 10));
  }

}
