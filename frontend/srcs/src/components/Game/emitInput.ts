import { ClientEvents, Input, InputPacket} from '@shared/class';
import { socket } from '../../socket';
import { usePlayerStore } from './PlayerStore';
import { useAppDispatch } from '../../redux/hooks';


export function emitInput(KeyboardInput: Input, prevInput: Input, id: number) {
	const dispatch = useAppDispatch();
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
		dispatch({
			type: 'WEBSOCKET_SEND_INPUT',
			payload: payload,
		});
		//socket.emit<InputPacket>(ClientEvents.InputState, payload);
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
	if (!KeyboardInput.up && prevInput.up) {
		console.log("stop up");
		console.log(prevInput);
		const timestamp: number = Math.floor(Date.now() / 1000);
		const code = 0;
		const payload: InputPacket = {
			code: code,
			timestamp: timestamp,
			pressed: false,
			id: id,
		}
		socket.emit<InputPacket>(ClientEvents.InputState, payload);
	}
	if (!KeyboardInput.right && prevInput.right) {
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
	if (!KeyboardInput.down && prevInput.down) {
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
	if (!KeyboardInput.left && prevInput.left) {
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
	if (!KeyboardInput.boost  && prevInput.boost) {
		const timestamp: number = Math.floor(Date.now() / 1000);
		const code = 4;
		const payload: InputPacket = {
			code: code,
			timestamp: timestamp,
			pressed: false,
			id: id,
		}
		socket.emit<InputPacket>(ClientEvents.InputState, payload);
	}
	if (!KeyboardInput.rotRight  && prevInput.rotRight) {
		const timestamp: number = Math.floor(Date.now() / 1000);
		const code = 5;
		const payload: InputPacket = {
			code: code,
			timestamp: timestamp,
			pressed: false,
			id: id,
		}
		socket.emit<InputPacket>(ClientEvents.InputState, payload);	
	}
	if (!KeyboardInput.rotLeft  && prevInput.rotLeft) {
		const timestamp: number = Math.floor(Date.now() / 1000);
		const code = 6;
		const payload: InputPacket = {
			code: code,
			timestamp: timestamp,
			pressed: false,
			id: id,
		}
		socket.emit<InputPacket>(ClientEvents.InputState, payload);	
	}
} 