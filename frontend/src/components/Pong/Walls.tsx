import { useBox } from "@react-three/cannon";

export const LeftWall: React.FC = (props) => {
	const [ref] = useBox(() => ({
	  position: [-props.mapData.width / 2, 0.10, 0], // Position du mur gauche
	  args: [0.1, 5, 5], // Largeur, hauteur, profondeur du mur
	  type: "Static", // Un mur est statique et ne bouge pas
	}));
  
	return (
	  <mesh ref={ref} receiveShadow>
		<boxBufferGeometry args={[0.1, 0.2, props.mapData.height]} />
		<meshStandardMaterial color="gray" />
	  </mesh>
	);
};

export const RightWall: React.FC = (props) => {
	const [ref] = useBox(() => ({
	  position: [props.mapData.width / 2, 0.10, 0], // Position du mur droit
	  args: [0.1, 5, 5], // Largeur, hauteur, profondeur du mur
	  type: "Static", // Un mur est statique et ne bouge pas
	}));
  
	return (
	  <mesh ref={ref} receiveShadow>
		<boxBufferGeometry args={[0.1, 0.20, props.mapData.height]} />
		<meshStandardMaterial color="gray" />
	  </mesh>
	);
};

export const TopWAll: React.FC = (props) => {
	const [ref] = useBox(() => ({
	  position: [0, 0.10, -props.mapData.height / 2], // Position du mur droit
	  args: [0.1, 5, 10], // Largeur, hauteur, profondeur du mur
	  rotation: [0, Math.PI / 2, 0],
	  type: "Static", // Un mur est statique et ne bouge pas
	}));
	return (
	  <mesh ref={ref} receiveShadow>
		<boxBufferGeometry args={[0.1, 0.20, props.mapData.width]} />
		<meshStandardMaterial color="gray" />
	  </mesh>
	);
};

export const BottomWall: React.FC = (props) => {
	const [ref] = useBox(() => ({
	  position: [0, 0.10, props.mapData.height / 2], // Position du mur droit
	  args: [0.1, 5, 5], // Largeur, hauteur, profondeur du mur
	  rotation: [0, Math.PI / 2, 0],
	  type: "Static", // Un mur est statique et ne bouge pas
	}));
  
	return (
	  <mesh ref={ref} receiveShadow>
		<boxBufferGeometry args={[0.1, 0.20, props.mapData.width]} />
		<meshStandardMaterial color="gray" />
	  </mesh>
	);
};

export const MiddleLine: React.FC = (props) => {
	const [ref] = useBox(() => ({
	  position: [0, -0.09, 0],
	  args: [0.1, 5, props.mapData.width], // Largeur, hauteur, profondeur du mur
	  rotation: [0, Math.PI / 2, 0],
	  type: "Static",
	  collisionFilterGroup: 0,
	}));
  
	return (
	  <mesh ref={ref} receiveShadow>
		<boxBufferGeometry args={[0.1, 0.20, props.mapData.width]} />
		<meshStandardMaterial color="white" />
	  </mesh>
	);
};

