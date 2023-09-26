import { Injectable } from '@nestjs/common';
import { CreateActionOnUserDto } from './dto/create-action-on-user.dto';
import { UpdateActionOnUserDto } from './dto/update-action-on-user.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class ActionOnUserService {
  constructor(private prisma: PrismaService) {}
  create(createActionOnUserDto: CreateActionOnUserDto) {
    return this.prisma.actionOnUser.create({ data: createActionOnUserDto });
  }

  findAll() {
    return this.prisma.actionOnUser.findMany({
      include: { chat: true },
    });
  }

  findOne(id: number) {
    return this.prisma.actionOnUser.findUnique({
      where: { id },
      include: { chat: true },
    });
  }

  update(id: number, updateActionOnUserDto: UpdateActionOnUserDto) {
    return this.prisma.actionOnUser.update({
      where: { id },
      data: updateActionOnUserDto,
    });
  }

  remove(id: number) {
    return this.prisma.actionOnUser.delete({
      where: { id },
    });
  }
}
