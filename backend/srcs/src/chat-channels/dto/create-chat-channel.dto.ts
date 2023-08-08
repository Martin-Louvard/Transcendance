import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { User } from 'src/users/entities/user.entity';

export class CreateChatChannelDto {

  @ApiProperty()
  ownerId: number;

  @ApiProperty()
  owner_username: string;

  @ApiPropertyOptional()
  password: string;

  @ApiPropertyOptional()
  channelType: string;

  @ApiPropertyOptional()
  name: string;

  @ApiPropertyOptional()
  bannedUsers: Array<User>;

  @ApiPropertyOptional()
  participants: Array<User>;
}
