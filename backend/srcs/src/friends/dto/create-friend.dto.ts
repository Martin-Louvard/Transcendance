import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateFriendDto {
  @ApiProperty()
  user_id: number;

  @ApiProperty()
  friend_id: number;

  @ApiProperty()
  sender_id: number;

  @ApiPropertyOptional()
  chat_id: number;

}
