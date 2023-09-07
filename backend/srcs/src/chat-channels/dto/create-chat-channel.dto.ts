import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { User } from 'src/users/entities/user.entity';

export class CreateChatChannelDto {
  @ApiProperty()
  ownerId: number;

  @ApiPropertyOptional()
  participants: User;

  @ApiPropertyOptional()
  channelType: string;
}
