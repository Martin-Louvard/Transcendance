import { IsString, isString } from "class-validator";
import { Socket } from "socket.io";

export class CreatePlayerDto {
	@IsString()
	id: string;
	
	socket: Socket;
	@IsString()
	pseudo: string;
}
