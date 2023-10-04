import { ApiProperty } from '@nestjs/swagger';
import {IsEmail, IsNotEmpty, MinLength } from 'class-validator';


export class CreateUserDto {
    @IsNotEmpty()
    @ApiProperty()
    @MinLength(1)
    username: string;

    @IsNotEmpty()
    @IsEmail()
    @ApiProperty()
    email: string;

    @IsNotEmpty()
    @ApiProperty()
    @MinLength(3)
    password: string;
}
