import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsString, MaxLength } from 'class-validator';
import { ChatChannel } from 'src/chat-channels/entities/chat-channel.entity';
import { User } from 'src/users/entities/user.entity';

export class CreateChatMessageDto {
  @ApiProperty()
  @IsNotEmpty()
  channel: ChatChannel;

  @ApiProperty()
  @IsNotEmpty()
  sender: User;

  @ApiProperty()
  @IsNotEmpty()
  @MaxLength(500)
  @IsString()
  content: string;

  @ApiPropertyOptional()
  readersId: number[];
}
