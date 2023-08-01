import { PartialType } from '@nestjs/swagger';
import { CreateUserDto } from './create-user.dto';
import { ApiProperty } from '@nestjs/swagger';
import { User } from '../entities/user.entity';

export class UpdateUserDto extends PartialType(CreateUserDto) {
    @ApiProperty()
    twoFAEnabled: boolean;

    @ApiProperty()
    victoriesCount: number;

    @ApiProperty()
    defeatCount: number;

    @ApiProperty()
    rank: string;

    @ApiProperty()
    level: number;

    @ApiProperty()
    friends: User;
}
