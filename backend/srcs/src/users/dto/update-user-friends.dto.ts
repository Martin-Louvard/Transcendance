import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';


export class UpdateUserFriendsDto {
    @ApiProperty()
    @IsNotEmpty()
    @IsString()
    friend_username: string;
}