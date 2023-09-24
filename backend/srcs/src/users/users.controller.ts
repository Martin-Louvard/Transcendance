import { UseInterceptors, UploadedFile, Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Query, Res } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UpdateUserFriendsDto } from './dto/update-user-friends.dto';
import { ApiTags, ApiBearerAuth, ApiCreatedResponse, ApiOkResponse, ApiNotFoundResponse } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { User } from './entities/user.entity';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer'
import { v4 as uuidv4 } from 'uuid';


const path = require('path');


@Controller('users')
@ApiTags('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  @ApiCreatedResponse({ type: User })
  create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  @Get()
  @ApiOkResponse({ type: User, isArray: true })
  findAll() {
    return this.usersService.findAll();
  }

  @Get(':username')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  findOne(@Param('username') username: string) {
    return this.usersService.findOne(username);
  }

  @Get(':id/games')
	async getGames(@Query('id') id: string) {
		return (await this.usersService.findById(+id)).games
	}

  @Get('id/:id')
  findById(@Query('id') id: string) {
    return this.usersService.findById(+id);
  }

  @Get('42user/:email42')
  findBy42Email(@Query('email42') email42: string) {
    return this.usersService.findBy42Email(email42);
  }

  @Get('friends/:id')
  findAllFriends(@Query('id') id: string){
    return this.usersService.findAllFriends(+id)
  }

  @Patch(':username')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiCreatedResponse({ type: User })
  update(@Param('username') username: string, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.update(username, updateUserDto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOkResponse({ type: User })
  remove(@Param('id') id: string) {
    return this.usersService.remove(+id);
  }

  @Post(':username/friends')
  @ApiCreatedResponse({ type: User })
  addFriend(@Param('username') username: string, @Body() updateUserFriendsDto: UpdateUserFriendsDto) {
    return this.usersService.addFriend(username, updateUserFriendsDto);
  }

  @Delete(':username/friends')
  removeFriend(@Param('username') username: string, @Body() updateUserFriendsDto: UpdateUserFriendsDto) {
    return this.usersService.removeFriend(username, updateUserFriendsDto);
  }

  @Post(':username/avatar')
  @UseInterceptors(FileInterceptor('file', {
    storage: diskStorage({
      destination: './uploads/avatars'
      , filename: (req, file, cb) => {
        const filename: string = path.parse(file.originalname).name.replace(/\s/g, '') + uuidv4();
        const extension: string = path.parse(file.originalname).ext;
        cb(null, `${filename}${extension}`)
      }
    })
  }))
  uploadAvatar(@Param('username') username: string, @UploadedFile() file) {
    return  this.usersService.updateAvatar(username, file);
  }

  @Get('avatar/:username/:randomString')
  findAvatarWithRefresh(@Param('username') username: string, @Res() res){
    try {
      return this.usersService.findAvatar(username, res)
    } catch(e) {
      return (e);
    }
  }

  @Get('avatar/:username')
  findAvatar(@Param('username') username: string, @Res() res){
    return this.usersService.findAvatar(username, res)
  }

}
