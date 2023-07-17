import { useBox, usePlane } from "@react-three/cannon";
import { useFrame } from "@react-three/fiber";
import { useRef } from "react";

interface PaddleProps {
	position: [number, number, number];
  }
  
export const Paddle: React.FC<PaddleProps> = ({ position }) => {
	const ref = useRef<any>();
  
	// Create a paddle using a box
	const [paddleApi] = useBox(() => ({
	  mass: 1,
	  args: [1, 0.1, 0.2], // width, height, depth
	  position: position,
	}));
  
  
	useFrame(() => {
	  ref.current!.position.y = 0.05;
	});
  
	return (
	  <mesh ref={ref} castShadow receiveShadow position={position}>
		<boxBufferGeometry args={[1, 0.1, 0.2]}  />
		<meshStandardMaterial color="blue" />
	  </mesh>
	);
  };
  
export const Ball: React.FC = () => {
	const ref = useRef<any>();
  
	// Create a ball using a sphere
	const [ballApi] = useBox(() => ({
	  mass: 1,
	  args:[ 0.1, 1, 1], // radius
	  position: [0, 0, 0],
	}));
  
	useFrame(() => {
	  // Make sure the ball cannot move in the z-axis
	  ref.current!.position.y = 0.1;
	});
  
	return (
	  <mesh ref={ref} castShadow receiveShadow  position={[0, 0.1, 0]}>
		<sphereBufferGeometry args={[0.1, 32, 32]} />
		<meshStandardMaterial color="red" />
	  </mesh>
	);
  };
  
export class MapData {
	width: number;
	height: number;
	constructor(width: number, height: number) {
	  this.width = width;
	  this.height = height;
	}
  }
  
export const Ground: React.FC = (props) => {
	const [ref] = usePlane(() => ({
	  rotation: [-Math.PI / 2, 0, 0],
	}));
	console.log(props);
	return (
	  <mesh ref={ref} receiveShadow>
		<planeBufferGeometry args={[props.mapData.width, props.mapData.height]} />
		<meshStandardMaterial color="green" />
	  </mesh>
	);
  };
  
  