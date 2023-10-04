import { useFrame, useThree } from "@react-three/fiber";
import { useEffect, useState } from "react";
import { useAppSelector } from "/src/redux/hooks";

export const Camera: React.FC = (props) => {
	let player = props.player;
	const ball = useAppSelector(state => state.websocket.balls[0]);
	let mapSize:{x: number, y: number} = props.mapSize;
	const [offset, setOffset] = useState([0, 0, 0]);
	const { camera } = useThree();
	const [view, setView] = useState(false);
	const [targetBall, setTargetBall] = useState(false);

	useEffect(() => {
		window.addEventListener('keyup', (e) => {
			if (e.key == 'V' || e.key == 'v') {
				setView((prev) => !prev);
				camera.lookAt(player.position[0], player.position[1] + offset[1], player.position[2]);
			}
			else if (e.key == 'U' || e.key == 'u') {
				setTargetBall((prev) => !prev);
			}
		});
	}, []);

	useFrame(() => {
		if (!player || !player.team)
			return ;
		if (view) {
			if (player.team == 'visitor') {
				if (player.position[2] < mapSize.y / 2 - 10)
					setOffset([0, 5, 10])
				else
					setOffset([0, 5, (mapSize.y / 2) - player.position[2]])
			} else {
				if (player.position[2] > -(mapSize.y / 2) + 10)
					setOffset([0, 5, -10])
				else
					setOffset([0, 5, -(mapSize.y / 2) - player.position[2]])
			}
			camera.position.set(player.position[0] + offset[0], player.position[1] + offset[1], player.position[2] + offset[2])
			targetBall && ball ?
				camera.lookAt(ball.position[0], 5, ball.position[2])
			:
				camera.lookAt(player.position[0], player.position[1] + offset[1], player.position[2])
	} else {
			camera.position.set(0, Math.max(mapSize.x, mapSize.y), 0)
			camera.lookAt(0, 5, 0);
		}
		if (player.team == 'home' && !view)
			camera.rotation.z = Math.PI;
	})
}
