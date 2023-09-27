import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { ActionOnUserService } from './action-on-user.service';
import { CreateActionOnUserDto } from './dto/create-action-on-user.dto';
import { UpdateActionOnUserDto } from './dto/update-action-on-user.dto';

@Controller('action-on-user')
export class ActionOnUserController {
  constructor(private readonly actionOnUserService: ActionOnUserService) {}

  @Post()
  create(@Body() createActionOnUserDto: CreateActionOnUserDto) {
    return this.actionOnUserService.create(createActionOnUserDto);
  }

  @Get()
  findAll() {
    return this.actionOnUserService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.actionOnUserService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateActionOnUserDto: UpdateActionOnUserDto) {
    return this.actionOnUserService.update(+id, updateActionOnUserDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.actionOnUserService.remove(+id);
  }
}
