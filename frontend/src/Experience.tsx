import { extend, useFrame } from "@react-three/fiber"
import { useRef, useEffect } from "react"
import { TrackballControls} from "@react-three/drei"
export default function Experience()
{

    const cubeRef = useRef()
    const sphereRef = useRef()
    const groupRef = useRef()


    useFrame((_state, delta) =>{
        groupRef.current.rotation.y += delta 
    })

    return <>
    <TrackballControls noPan noZoom/>
        <directionalLight position={[1, 2, 3]} intensity={1.5}/>
        <ambientLight intensity={0.5}/>

        <group ref={groupRef}>
            <mesh ref={sphereRef} position-x={-2}>
                <sphereGeometry/>
                <meshStandardMaterial color={0x646cffff} />
                
            </mesh>

            <mesh ref={cubeRef} position-x={2}>
                <sphereGeometry />
                <meshStandardMaterial color='mediumpurple' />
            </mesh>
        </group>
    </>
}