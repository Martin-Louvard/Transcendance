import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { ChatChannelsService } from './chat-channels.service';
import { CreateChatChannelDto } from './dto/create-chat-channel.dto';
import { UpdateChatChannelDto } from './dto/update-chat-channel.dto';
import { ApiTags } from '@nestjs/swagger';

@Controller('chat-channels')
@ApiTags('chat-channels')
export class ChatChannelsController {
  constructor(private readonly chatChannelsService: ChatChannelsService) {}

  @Post()
  create(@Body() createChatChannelDto: CreateChatChannelDto) {
    return this.chatChannelsService.create(createChatChannelDto);
  }

  @Post(':id')
  checkPassword(@Param('id') id: string, @Body() body){
    return this.chatChannelsService.checkPassword(+id, body.password);
  }


  @Get()
  findAll() {
    return this.chatChannelsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.chatChannelsService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateChatChannelDto: UpdateChatChannelDto) {
    return this.chatChannelsService.update(+id, updateChatChannelDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.chatChannelsService.remove(+id);
  }
}
