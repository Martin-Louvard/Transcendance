import { IsInt, IsString, Max, Min } from "class-validator";

export class CreateLobbyDto {
	@IsInt()
	@Min(0)
	@Max(1)
	mode : number

	@IsString()
	id: string
}
