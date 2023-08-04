import { PartialType } from '@nestjs/swagger';
import { CreateChatChannelDto } from './create-chat-channel.dto';
import { ApiProperty } from '@nestjs/swagger';
import { User } from 'src/users/entities/user.entity';

export class UpdateChatChannelDto extends PartialType(CreateChatChannelDto) {
  @ApiProperty()
  bannedUsers: Array<User>;

  @ApiProperty()
  participants: Array<User>;
}
