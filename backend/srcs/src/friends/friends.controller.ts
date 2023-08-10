import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { FriendsService } from './friends.service';
import { CreateFriendDto } from './dto/create-friend.dto';
import { UpdateFriendDto } from './dto/update-friend.dto';
import { ApiTags, ApiBearerAuth, ApiCreatedResponse, ApiOkResponse, ApiNotFoundResponse } from '@nestjs/swagger';
import { Friend } from './entities/friend.entity';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';

@Controller('friends')
@ApiTags('friends')
export class FriendsController {
  constructor(private readonly friendsService: FriendsService) {}

  @Post()
  @ApiCreatedResponse({ type: Friend })
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  create(@Body() createFriendDto: CreateFriendDto) {
    return this.friendsService.create(createFriendDto);
  }

  @Get()
  @ApiCreatedResponse({ type: Friend })
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  findAll() {
    return this.friendsService.findAll();
  }

  @Get(':id')
  @ApiCreatedResponse({ type: Friend })
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  findOne(@Param('id') id: string) {
    return this.friendsService.findOne(+id);
  }

  @Patch(':id')
  @ApiCreatedResponse({ type: Friend })
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  update(@Param('id') id: string, @Body() updateFriendDto: UpdateFriendDto) {
    return this.friendsService.update(+id, updateFriendDto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  remove(@Param('id') id: string) {
    return this.friendsService.remove(+id);
  }
}
