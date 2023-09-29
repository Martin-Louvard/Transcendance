import { ApiProperty } from '@nestjs/swagger';
import {IsEmail, IsNotEmpty } from 'class-validator';


export class CreateUserDto {
    @IsNotEmpty()
    @ApiProperty()
    username: string;

    @IsNotEmpty()
    @IsEmail()
    @ApiProperty()
    email: string;

    @IsNotEmpty()
    @ApiProperty()
    password: string;
}
