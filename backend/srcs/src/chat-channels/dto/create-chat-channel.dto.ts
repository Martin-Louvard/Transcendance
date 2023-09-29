import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNumber } from 'class-validator';
import { User } from 'src/users/entities/user.entity';

export class CreateChatChannelDto {
  @ApiProperty()
  @IsNumber()
  ownerId: number;

  @ApiPropertyOptional()
  participants: User;

  @ApiPropertyOptional()
  channelType: string;
}
