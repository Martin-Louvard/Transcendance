import { ApiProperty } from '@nestjs/swagger';


export class UpdateUserFriendsDto {
    @ApiProperty()
    friend_username: string;
}