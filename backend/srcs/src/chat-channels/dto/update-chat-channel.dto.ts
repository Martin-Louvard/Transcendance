import { ApiPropertyOptional, PartialType } from '@nestjs/swagger';
import { CreateChatChannelDto } from './create-chat-channel.dto';
import { ApiProperty } from '@nestjs/swagger';
import { User } from 'src/users/entities/user.entity';
import { ChatMessage } from 'src/chat-messages/entities/chat-message.entity';
import { IsNotEmpty, MinLength } from 'class-validator';

export class UpdateChatChannelDto extends PartialType(CreateChatChannelDto) {
  @ApiPropertyOptional()
  password: string;

  @ApiPropertyOptional()
  @IsNotEmpty()
  channelType: string;

  @ApiPropertyOptional()
  name: string;

  @ApiPropertyOptional()
  admins: User;

  @ApiPropertyOptional()
  participants: User;

  @ApiPropertyOptional()
  bannedUsers: User;

  @ApiPropertyOptional()
  messages: ChatMessage;
}
