import { Sphere } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { useRef } from "react";
import { DoubleSide } from "three";

export const Ball: React.FC = (props) => {
	const ballRef = useRef<Mesh>(null!)

	useFrame(() => {
		ballRef.current.position.set(props.position[0], props.position[1], props.position[2]);
		ballRef.current.quaternion.set(props.quaternion.x, props.quaternion.y, props.quaternion.z, props.quaternion.w);
	  })
	  
	return (
		<mesh position={[0, 0, 0]} ref={ballRef}>
			<Sphere args={props.args}>
				<meshPhongMaterial color="white" side={DoubleSide} />
			</Sphere>
	  </mesh>
	)
}
