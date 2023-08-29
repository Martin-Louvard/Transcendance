import { useEffect, useState } from "react";
import { usePlayerStore } from "./PlayerStore"
import { Input } from '@shared/class';

export const useKeyboardInput = () => {
	const [input, setInput] = useState<Input>({
		up: false,
		down: false,
		right: false,
		left: false,
		boost: false,
		rotRight: false,
		rotLeft: false,
	});
  
	const handleKeyDown = (event) => {
		const key = event.keyCode == 32 ? 'space' : event.key.toLowerCase();
		switch (key) {
			case 'arrowup':
				setInput(prevState => ({ ...prevState, up: true }));
				break;
			case 'arrowdown':
				setInput(prevState => ({ ...prevState, down: true }));
				break;
			case 'arrowright':
				setInput(prevState => ({ ...prevState, right: true }));
				break;
			case 'arrowleft':
				setInput(prevState => ({ ...prevState, left: true }));
				break;
			case 'z':
				setInput(prevState => ({ ...prevState, up: true }));
				break;
			case 's':
				setInput(prevState => ({ ...prevState, down: true }));
				break;
			case 'd':
				setInput(prevState => ({ ...prevState, right: true }));
				break;
			case 'q':
				setInput(prevState => ({ ...prevState, left: true }));
				break;
			case 'space':
				setInput(prevState => ({ ...prevState, boost: true }));
				break;
			case 'a':
				setInput(prevState => ({...prevState, rotLeft: true}));
				break ;
			case 'b':
				setInput(prevState => ({...prevState, rotLeft: true}));
				break ;
			default:
				break;
		}
	};
  
	const handleKeyUp = (event) => {
		const key = event.keyCode == 32 ? 'space' : event.key.toLowerCase();
		switch (key) {
			case 'arrowup':
				setInput(prevState => ({ ...prevState, up: false }));
				break;
			case 'arrowdown':
				setInput(prevState => ({ ...prevState, down: false }));
				break;
			case 'arrowright':
				setInput(prevState => ({ ...prevState, right: false }));
				break;
			case 'arrowleft':
				setInput(prevState => ({ ...prevState, left: false }));
				break;
			case 'z':
				setInput(prevState => ({ ...prevState, up: false }));
				break;
			case 's':
				setInput(prevState => ({ ...prevState, down: false }));
				break;
			case 'd':
				setInput(prevState => ({ ...prevState, right: false }));
				break;
			case 'q':
				setInput(prevState => ({ ...prevState, left: false }));
				break;
			case 'space':
				setInput(prevState => ({ ...prevState, boost: false }));
				break;
			case 'a':
				setInput(prevState => ({...prevState, rotLeft: false}));
				break ;
			case 'b':
				setInput(prevState => ({...prevState, rotLeft: false}));
				break ;
			default:
				break;
		}
	};
  
	useEffect(() => {
		window.addEventListener('keydown', handleKeyDown);
		window.addEventListener('keyup', handleKeyUp);
	
		return () => {
			window.removeEventListener('keydown', handleKeyDown);
			window.removeEventListener('keyup', handleKeyUp);
		};
	}, []);
  
	return [input];
  };