import { ApiProperty } from '@nestjs/swagger';
import { User } from 'src/users/entities/user.entity';

export class CreateChatChannelDto {
    @ApiProperty()
    owner: User

    @ApiProperty()
    password: string

    @ApiProperty()
    channelType: string

    @ApiProperty()
    name: string

    @ApiProperty()
    participants: User
}
