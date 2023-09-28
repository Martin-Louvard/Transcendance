import { PartialType } from '@nestjs/swagger';
import { CreateUserDto } from './create-user.dto';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { User } from '../entities/user.entity';

export class UpdateUserDto extends PartialType(CreateUserDto) {

    @ApiPropertyOptional()
    victoriesCount?: number;

    @ApiPropertyOptional()
    defeatCount?: number;

    @ApiPropertyOptional()
    rank?: string;

    @ApiPropertyOptional()
    level?: number;

    @ApiPropertyOptional()
    friends?: User;

    @ApiPropertyOptional()
    twoFASecret?: string;

    @ApiPropertyOptional()
    username?: string;
}
