import { ApiProperty } from '@nestjs/swagger';


export class CreateUserDto {
    @ApiProperty()
    username: string;
  
    @ApiProperty()
    password: string;
  
    @ApiProperty()
    rank: string;
  
    @ApiProperty()
    status: string;
}
