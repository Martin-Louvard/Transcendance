import { ClientEvents, Input, InputPacket} from '@shared/class';
import { socket } from '../../socket';
import { usePlayerStore } from './PlayerStore';


export function emitInput(KeyboardInput: Input, prevInput: Input, id: number) {

	// PRESSED
	if (KeyboardInput.up) {
		const timestamp: number = Math.floor(Date.now() / 1000);
		const code = 0;
		const payload: InputPacket = {
			code: code,
			timestamp: timestamp,
			pressed: true,
			id: id,
		}
		console.log('up');
		socket.emit<InputPacket>(ClientEvents.InputState, payload);
	}
	if (KeyboardInput.right) {
		const timestamp: number = Math.floor(Date.now() / 1000);
		const code = 1;
		const payload: InputPacket = {
			code: code,
			timestamp: timestamp,
			pressed: true,
			id: id,
		}
		socket.emit<InputPacket>(ClientEvents.InputState, payload);
	}
	if (KeyboardInput.down) {
		const timestamp: number = Math.floor(Date.now() / 1000);
		const code = 2;
		const payload: InputPacket = {
			code: code,
			timestamp: timestamp,
			pressed: true,
			id: id,
		}
		socket.emit<InputPacket>(ClientEvents.InputState, payload);
	}
	if (KeyboardInput.left) {
		const timestamp: number = Math.floor(Date.now() / 1000);
		const code = 3;
		const payload: InputPacket = {
			code: code,
			timestamp: timestamp,
			pressed: true,
			id: id,
		}
		socket.emit<InputPacket>(ClientEvents.InputState, payload);
	}
	if (KeyboardInput.boost) {
		const timestamp: number = Math.floor(Date.now() / 1000);
		const code = 4;
		const payload: InputPacket = {
			code: code,
			timestamp: timestamp,
			pressed: true,
			id: id,
		}
		socket.emit<InputPacket>(ClientEvents.InputState, payload);
	}
	if (KeyboardInput.rotRight) {
		const timestamp: number = Math.floor(Date.now() / 1000);
		const code = 5;
		const payload: InputPacket = {
			code: code,
			timestamp: timestamp,
			pressed: true,
			id: id,
		}
		socket.emit<InputPacket>(ClientEvents.InputState, payload);	
	}
	if (KeyboardInput.rotLeft) {
		const timestamp: number = Math.floor(Date.now() / 1000);
		const code = 6;
		const payload: InputPacket = {
			code: code,
			timestamp: timestamp,
			pressed: true,
			id: id,
		}
		socket.emit<InputPacket>(ClientEvents.InputState, payload);	
	}

	// RELEASED
	if (!KeyboardInput.up) {
		const timestamp: number = Math.floor(Date.now() / 1000);
		const code = 0;
		const payload: InputPacket = {
			code: code,
			timestamp: timestamp,
			pressed: false,
			id: id,
		}
		console.log('up');
		socket.emit<InputPacket>(ClientEvents.InputState, payload);
	}
	if (!KeyboardInput.right) {
		const timestamp: number = Math.floor(Date.now() / 1000);
		const code = 1;
		const payload: InputPacket = {
			code: code,
			timestamp: timestamp,
			pressed: false,
			id: id,
		}
		socket.emit<InputPacket>(ClientEvents.InputState, payload);
	}
	if (!KeyboardInput.down) {
		const timestamp: number = Math.floor(Date.now() / 1000);
		const code = 2;
		const payload: InputPacket = {
			code: code,
			timestamp: timestamp,
			pressed: false,
			id: id,
		}
		socket.emit<InputPacket>(ClientEvents.InputState, payload);
	}
	if (!KeyboardInput.left) {
		const timestamp: number = Math.floor(Date.now() / 1000);
		const code = 3;
		const payload: InputPacket = {
			code: code,
			timestamp: timestamp,
			pressed: false,
			id: id,
		}
		socket.emit<InputPacket>(ClientEvents.InputState, payload);
	}
} 