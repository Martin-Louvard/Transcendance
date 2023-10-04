import { Box } from "@react-three/drei";
import { GameParameters, LobbyType } from "@shared/class";
import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "/src/redux/hooks";
import { setParams } from "/src/redux/websocketSlice";

const Cage: React.FC = (props) => {
	const goalSize = props.goalSize
	const mapSize = props.mapSize;
	const team = props.team;
	if (team) {
		return (
			<mesh >
				<Box args={[goalSize, 2, 0.1]} position={[0, 10, mapSize[1] / 2 - 1]}  >
					<meshPhongMaterial color="white"  />
				</Box>
				<Box args={[2, 10, 0.1]} position={[goalSize / 2 - 1, 5, mapSize[1] / 2 - 1]}  >
					<meshPhongMaterial color="white"  />
				</Box>
				<Box args={[2, 10, 0.1]} position={[-(goalSize / 2 - 1), 5, mapSize[1] / 2 - 1]}  >
					<meshPhongMaterial color="white"  />
				</Box>
			</mesh>
		);
	} else {
		return (
			<mesh >
				<Box args={[goalSize, 2, 0.1]} position={[0, 10, -(mapSize[1] / 2 - 1)]}  >
					<meshPhongMaterial color="white"  />
				</Box>
				<Box args={[2, 10, 0.1]} position={[goalSize / 2 - 1, 5, -(mapSize[1] / 2 - 1)]}  >
					<meshPhongMaterial color="white"  />
				</Box>
				<Box args={[2, 10, 0.1]} position={[-(goalSize / 2 - 1), 5, -(mapSize[1] / 2 - 1)]}  >
					<meshPhongMaterial color="white"  />
				</Box>
			</mesh>
		);
	}
}

export const Goals: React.FC = (props) => {
	const game = useAppSelector((state) => state.websocket);
	const dispatch = useAppDispatch();

	useEffect(() => {
		if (game.LobbyType == LobbyType.auto) {
 			const params: GameParameters = JSON.parse(JSON.stringify(game.params));
			params.map.size[1] = 200;
			params.map.goalSize = 40;
			dispatch(setParams(params));
		}
	}, [])

	return (
		<>
			<Cage goalSize={game.params.map.goalSize} mapSize={game.params.map.size} team={false} />
			<Cage goalSize={game.params.map.goalSize} mapSize={game.params.map.size} team={true} />
		</>
	);
}