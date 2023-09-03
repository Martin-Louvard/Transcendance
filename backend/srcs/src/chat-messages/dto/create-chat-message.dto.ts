import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { ChatChannel } from 'src/chat-channels/entities/chat-channel.entity';
import { User } from 'src/users/entities/user.entity';

export class CreateChatMessageDto {
  @ApiProperty()
  channel: ChatChannel;

  @ApiProperty()
  sender: User;

  @ApiProperty()
  content: string;

  @ApiPropertyOptional()
  readersId: number[];
}
