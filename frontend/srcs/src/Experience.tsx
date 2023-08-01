import { useFrame } from "@react-three/fiber"
import { useRef } from "react"
import { TrackballControls, PerspectiveCamera} from "@react-three/drei"
export default function Experience()
{


    const groupRef = useRef()
    const centerRef = useRef()


    useFrame((_state, delta) =>{
        groupRef.current.rotation.y += delta 
    })

    return <>
    <TrackballControls noPan noZoom/>
        <directionalLight position={[1, 2, 3]} intensity={1.5}/>
        <ambientLight intensity={0.5}/>
        <PerspectiveCamera position={[0, 0, -10]} rotation-x={1.5}>
        <group ref={groupRef}>
            <mesh  position-x={-2}>
                <boxGeometry />
                <meshStandardMaterial color={0x646cffff} />
            </mesh>

            <mesh  position-x={2}>
                <boxGeometry />
                <meshStandardMaterial color='mediumpurple' />
            </mesh>
        </group>

        <mesh  position-y={-2} rotation-x={-1.5} scale={50}>
                <planeGeometry />
                <meshStandardMaterial color='#949FCF' />
        </mesh>

        <mesh  ref={centerRef} position-x={0} scale={0.25}>
                <sphereGeometry/>
                <meshStandardMaterial color='yellow' />
        </mesh>
        </PerspectiveCamera>
    </>
}