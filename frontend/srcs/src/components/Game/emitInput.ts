import { ClientEvents, Input, InputPacket} from '@shared/class';
import { socket } from 'src/socket';

export function emitInput(KeyboardInput: Input) {
	//const player = usePlayerStore();

	if (KeyboardInput.up) {
		const timestamp: number = Math.floor(Date.now() / 1000);
		const code = 0;
		const payload: InputPacket = {
			code: code,
			timestamp: timestamp,
		}
		socket.emit<InputPacket>(ClientEvents.InputState, payload);
	}
	if (KeyboardInput.right) {
		const timestamp: number = Math.floor(Date.now() / 1000);
		const code = 1;
		const payload: InputPacket = {
			code: code,
			timestamp: timestamp,
		}
		socket.emit<InputPacket>(ClientEvents.InputState, payload);
	}
	if (KeyboardInput.down) {
		const timestamp: number = Math.floor(Date.now() / 1000);
		const code = 2;
		const payload: InputPacket = {
			code: code,
			timestamp: timestamp,
		}
		socket.emit<InputPacket>(ClientEvents.InputState, payload);
	}
	if (KeyboardInput.left) {
		const timestamp: number = Math.floor(Date.now() / 1000);
		const code = 3;
		const payload: InputPacket = {
			code: code,
			timestamp: timestamp,
		}
		socket.emit<InputPacket>(ClientEvents.InputState, payload);
	}
	if (KeyboardInput.boost) {
		const timestamp: number = Math.floor(Date.now() / 1000);
		const code = 4;
		const payload: InputPacket = {
			code: code,
			timestamp: timestamp,
		}
		socket.emit<InputPacket>(ClientEvents.InputState, payload);
	}
	if (KeyboardInput.rotRight) {
		const timestamp: number = Math.floor(Date.now() / 1000);
		const code = 5;
		const payload: InputPacket = {
			code: code,
			timestamp: timestamp,
		}
		socket.emit<InputPacket>(ClientEvents.InputState, payload);	
	}
	if (KeyboardInput.rotLeft) {
		const timestamp: number = Math.floor(Date.now() / 1000);
		const code = 6;
		const payload: InputPacket = {
			code: code,
			timestamp: timestamp,
		}
		socket.emit<InputPacket>(ClientEvents.InputState, payload);	
	}
} 