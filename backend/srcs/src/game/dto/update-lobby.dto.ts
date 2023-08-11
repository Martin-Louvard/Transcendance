import { PartialType } from '@nestjs/mapped-types';
import { CreateLobbyDto } from './create-lobby.dto';
import { IsInt, IsString, Max, Min } from 'class-validator';


export class UpdateLobbyDto extends PartialType(CreateLobbyDto) {
	@IsInt()
	@Min(0)
	@Max(1)
	mode : number
}
