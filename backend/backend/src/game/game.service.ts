import { Injectable } from '@nestjs/common';


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
	isCollidable: number;
	rollingFriction: number;
	gameObject: GameObject;
	constructor(name: string, position: Vector3, radius:number, mass: number) {
		this.gameObject = new GameObject(name, position, radius, radius);
		this.radius = radius;
		this.mass = mass;
	}
}

export class Score {
	player1: number;
	player2: number;
}

export class GameState {
	ball: Ball;
	player1: Player;
	player2: Player;
	constructor(ball: Ball, player1: Player, player2: Player) {
		this.ball = ball;
		this.player1 = player1;
		this.player2 = player2;
	}
	//score: Score;
}


@Injectable()
export class GameService {
	StartGame() {
		var ball = new Ball("ball", {x: 0, y: 0, z: 0}, 2, 10);
		var player1 = new Player("player1", 400, 200);
		var player2 = new Player("player2", 400, 200);
		var gameState = new GameState(ball, player1, player2);
		return gameState;
	}
}

