import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  create(createUserDto: CreateUserDto) {
    return this.prisma.user.create({ data: createUserDto });
  }

  findAll() {
    return this.prisma.user.findMany();
  }

  findOne(username: string) {
    return this.prisma.user.findUnique({ where: { username } });
  }

  update(username: string, updateUserDto: UpdateUserDto) {
    return this.prisma.user.update({
      where: { username },
      data: updateUserDto,
    });
  }

  removeId(id: number) {
    return this.prisma.user.delete({ where: { id } });
  }

  removeUsrName(username: string) {
    return this.prisma.user.delete({ where: { username } });
  }

  async deleteByIdentifier(identifier: string): Promise<void> {
    const isNum = /^\d+$/.test(identifier);
    if (isNum) {
      await this.prisma.user.delete({ where: { id: parseInt(identifier) } });
    } else {
      await this.prisma.user.delete({ where: { username: identifier } });
    }
  }
}
