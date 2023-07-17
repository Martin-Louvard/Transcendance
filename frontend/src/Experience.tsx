import { useEffect, useRef, useState } from "react"
import { TrackballControls, PerspectiveCamera} from "@react-three/drei"
import axios from "axios";

export class Vector3 {
	x: number;
	y: number;
	z: number;
}

class GameObject {
	name: string;
	position: Vector3
	width: number;
	height: number;

	constructor(name: string, position: Vector3, width: number, height: number) {
		this.name = name;
		this.width = width;
		this.height = height;
		this.position = position;
	}
}

export class Ball {
	radius: number;
	mass: number;
	velocity: Vector3;
	rotation:Vector3;
	rollSpeed: number;
	angularVelocity: Vector3;
	bounceCoefficient: number;
	isCollidable: boolean;
	rollingFriction: number;
	gameObject: GameObject;
	constructor(name: string, position: Vector3, radius:number, mass: number) {
		this.gameObject = new GameObject(name, position, radius, radius);
		this.radius = radius;
		this.mass = mass;
        this.velocity = {x: 0, y: 0, z:0};
        this.rotation = {x: 0, y:0, z:0};
        this.angularVelocity = {x: 0, y: 0, z: 0};
        this.rollSpeed = 5;
        this.bounceCoefficient = 0;
        this.isCollidable = false;
        this.rollSpeed = 0;
        this.rollingFriction = 0;
	}
}

export class Player {
	rotation: number; // angle de rotation autour de l'axe vertical (Y)
	speed: number;
	maxSpeed: number;
	acceleration: number;
	maxAcceleration: number;
	isAccelerating: boolean;
	accelerationTime: number;
	accelerationCooldown: number;
	gameObject: GameObject;

	constructor(name:string, width : number, height  : number, 
		position?: Vector3, rotation?: number, speed?: number, maxSpeed?: number,
		maxAcceleration?: number, accelerationCooldown?: number) {
		this.gameObject = new GameObject(name, position ? position :{x: 0, y: 0, z: 0}, width, height);
		position ? this.gameObject. position = position : this.gameObject. position = {x: 0, y: 0, z: 0};
		rotation ? this.rotation = rotation : this.rotation = 0;
		speed ? this.speed = speed : this.speed = 0;
		maxAcceleration ? this.maxAcceleration = maxAcceleration : this.maxAcceleration = 0.5;
		maxSpeed ? this.maxSpeed = maxSpeed : this.maxSpeed = 100;
		accelerationCooldown ? this.accelerationCooldown = accelerationCooldown : this.accelerationCooldown = 5;
        this.acceleration = 0;
        this.isAccelerating = false;
        this.accelerationTime = 5;
	}
}

export default function Experience()
{

    const [ball, setBall]= useState(new Ball("test", {x:0,y:0,z:0}, 0, 0));
    const [player1, setPlayer1]= useState(new Player("test1", 400, 200, {x: 0, y: 0, z:0}));
    const [player2, setPlayer2]= useState(new Player("test2", 400, 200, {x: 0, y: 0, z:0}));
    const groupRef = useRef(null)
    const centerRef = useRef(null)

    const fetchData = async () => {
        try {
            const response = await axios.get('http://localhost:3001/game');
        //  setData(response.data);
        setBall(new Ball(response.data.ball.gameObject.name, response.data.ball.position, response.data.ball.radius, response.data.ball.mass));
        setPlayer1(new Player(response.data.player1.name, response.data.player1.gameObject.width, response.data.player1.gameObject.height));
        setPlayer2(new Player(response.data.player2.name, response.data.player2.gameObject.width, response.data.player2.gameObject.height));
        console.log(ball);
        } catch (error) {
          console.error(error);
        }
      };
  
    //useFrame((_state, delta) =>{
    //    groupRef.current.rotation.y += delta 
    //})
    useEffect(() => {
        fetchData();
    }, []);
    return <>
    <TrackballControls noPan noZoom/>
        <directionalLight position={[1, 2, 3]} intensity={1.5}/>
        <ambientLight intensity={0.5}/>
        <PerspectiveCamera position={[0, 0, -10]} rotation-x={1.5}>
        <group ref={groupRef}>
            {
                player2 ?
                <mesh  position-x={-2}>
                <boxGeometry />
                <meshStandardMaterial color={0x646cffff}/>
            </mesh>
            : null}
        { player1 ?
            <mesh  position-x={2}>
                <boxGeometry />
                <meshStandardMaterial color='mediumpurple' />
            </mesh>
        : null}
        </group>

        <mesh  position-y={-2} rotation-x={-1.5} scale={50}>
                <planeGeometry />
                <meshStandardMaterial color='#949FCF' />
        </mesh>
       { ball ? 
        <mesh  ref={centerRef} position-x={0} scale={ball.radius}>
                <sphereGeometry/>
                <meshStandardMaterial color='yellow' />
        </mesh>
        :
            null }
        </PerspectiveCamera>
    </>
}