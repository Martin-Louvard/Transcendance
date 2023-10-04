import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber } from 'class-validator';

export class CreateFriendDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsNumber()
  user_id: number;

  @ApiProperty()
  @IsNotEmpty()
  @IsNumber()
  friend_id: number;

  @ApiProperty()
  @IsNotEmpty()
  @IsNumber()
  sender_id: number;

  @ApiPropertyOptional()
  chat_id: number;

}
