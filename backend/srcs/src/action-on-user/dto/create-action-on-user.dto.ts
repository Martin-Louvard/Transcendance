import { ApiProperty } from '@nestjs/swagger';

export class CreateActionOnUserDto {
  @ApiProperty()
  user_id: number;

  @ApiProperty()
  chat_id: number;

  @ApiProperty()
  action: string;

  @ApiProperty()
  time: number;
}
