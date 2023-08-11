import { ValidationArguments, ValidatorConstraint, ValidatorConstraintInterface } from "class-validator";
import { Socket } from "socket.io";

/*  Pas tres utile je pense 
A implementer pour Player et Lobby certainement.
*/

@ValidatorConstraint()
export class SocketValidator implements ValidatorConstraintInterface {
	validate(socket: Socket, args: ValidationArguments) {
		return (socket.id != '0');
	}
}