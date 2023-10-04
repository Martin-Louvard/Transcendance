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
    const sortedWithWin = sortedUsers.filter(u => (u.victoriesCount > 0))
    const length = sortedWithWin.length < 10 ? sortedWithWin.length : 10
    return (sortedWithWin.slice(0, length));
  }

}
