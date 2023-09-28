import { useFrame, useThree } from "@react-three/fiber";

export const Camera: React.FC = (props) => {
	let player = props.player;
	let mapSize:{x: number, y: number} = props.mapSize;

	const { camera } = useThree();

	useFrame(() => {
		if (!player)
			return ;
		camera.position.set(0, Math.max(mapSize.x, mapSize.y), 0)
		camera.lookAt(0,0, 0);
		if (player.team == 'home')
			camera.rotation.z = Math.PI;
	})
}
