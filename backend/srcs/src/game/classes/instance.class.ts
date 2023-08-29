import { Timeout } from "@nestjs/schedule";
import { Ball, GameData, LobbyMode, PlayerBody, ServerEvents, ServerPayloads, InputPacket} from "@shared/class";
import { Lobby } from "./lobby.class";
import * as CANNON from 'cannon-es'
import { Player } from "../player/player.class";

interface Sphere {
	radius: number;
	body: CANNON.Body | null;
}

interface Paddle {
	size: [number, number, number],
	acceleration: CANNON.Vec3,
	body: CANNON.Body | null;
	previousVelocity: CANNON.Vec3;
	player: Player;
	lastMovement: number | null;
}

interface World {
	world: CANNON.World | null;
	groundBody: CANNON.Body | null;
	players: Map<number, Paddle> | null;
	balls: Sphere[] | null;
}


export class Instance {
	constructor(lobby: Lobby) {
		this.lobby = lobby;
		this.id = Instance.nbInstances++;
	}
	lobby: Lobby;
	private static nbInstances: number = 0;
	public readonly id: number = 0;
	private interval;
	private maxPlayer: number;
	hasStarted: boolean = false; // A recuperer dans l'instance
	hasFinished: boolean = false; // A recuperer dans l'instance
	isSuspended: boolean = false; // A recuperer dans l'instance
	scores: {home: number, visitor: number}= {home: 0, visitor: 0}; // A recuperer dans l'instance
	private startTriggered: boolean = false; // Permet de savoir si le Start a deja été trigger pour annuler un start si
	private moveDistance: number = 20; // this could be sended by the host of the game in the game parameter
	private linearLocalVelocity = new CANNON.Vec3();
	private lateralLocalVelocity = new CANNON.Vec3();
	accelerationRate = 50;
	maxAcceleration = 5000;

	// un player quitte pendant le temps d'attente du demarage
	private data: GameData = {
		mapHeight:  100,
		mapWidth: 200,
		balls: null,
		players: null,
	};
	private world: World = {
		world: null,
		groundBody: null,
		players: null,
		balls: null,
	}


	isInstanceOfInputPacket(object: any): boolean {
		return ('code' in object && 'timestamp' in object);
	}
	processGameData<T extends InputPacket>(data: T) {
		if (this.isInstanceOfInputPacket(data)) {
			const paddle = this.world.players.get(data.id);
			const input: InputPacket = data;
			let directionVector = new CANNON.Vec3();
			let worldVelocity: CANNON.Vec3 = new CANNON.Vec3();
			let rotationQuaternion = new CANNON.Quaternion();
			let axisY =  new CANNON.Vec3( 0, 1, 0 );
			let rotateAngle;
			let accelerationForce = new CANNON.Vec3();
			if (!paddle)
				return undefined; //player dont exist error
			switch (input.code) {
				case 0: // move up
					directionVector.set(0, 0, this.moveDistance);
					paddle.body.quaternion.vmult(directionVector, worldVelocity);
					paddle.body.velocity.x = worldVelocity.x;
					paddle.body.velocity.z = worldVelocity.z;
					console.log("caca");
					break ;
				case 1: // move right
					directionVector.set( this.moveDistance, 0,0);
					paddle.body.quaternion.vmult(directionVector, worldVelocity);
					paddle.body.velocity.x = worldVelocity.x;
					paddle.body.velocity.z = worldVelocity.z;
					break ;
				case 2: // move down
					directionVector.set(0, 0, -this.moveDistance);
					paddle.body.quaternion.vmult(directionVector, worldVelocity);
					paddle.body.velocity.x = worldVelocity.x;
					paddle.body.velocity.z = worldVelocity.z;
					break ;
				case 3: //move left
					directionVector.set( -this.moveDistance, 0,0);
					paddle.body.quaternion.vmult(directionVector, worldVelocity);
					paddle.body.velocity.x = worldVelocity.x;
					paddle.body.velocity.z = worldVelocity.z;
					break ;
				case 4: // boost
					break ;
				case 5: // rotate right
					rotateAngle = Math.PI / 2 * (1 / 60);
					rotationQuaternion.setFromAxisAngle(axisY, -rotateAngle);
					paddle.body.quaternion = rotationQuaternion.mult(paddle.body.quaternion);
					console.log("right");
					break ;
				case 6: // rotate left
					rotateAngle = Math.PI / 2 * (1 / 60);
					rotationQuaternion.setFromAxisAngle(axisY, rotateAngle);
					paddle.body.quaternion = rotationQuaternion.mult(paddle.body.quaternion);
					console.log("left");
					break ;
				default:
					break;
			}
			//paddle.lastMovement = 
		}
	}
	triggerStart() {
		this.hasStarted = true;
		this.maxPlayer = this.lobby.mode;
		this.startTriggered = true;
		this.generate();
		const payload: ServerPayloads[ServerEvents.LobbyState] = {
			lobbyId: this.lobby.id,
			mode: this.lobby.mode,
			hasStarted: this.hasStarted,
			hasFinished: this.hasFinished,
			playersCount: this.lobby.nbPlayers,
			isSuspended: this.isSuspended,
		};
		console.log(`${this.lobby.id} is full, game starting`);
		this.lobby.emit<ServerPayloads[ServerEvents.LobbyState]>(ServerEvents.LobbyState, payload);
		this.gameLogic();
	}

	triggerFinish() {
		this.hasFinished = true;
	}

	collision(event) {
		const contact = event.contact;

		//console.log(contact);
	}

	generate() {
		this.world.world = new CANNON.World({
			gravity: new CANNON.Vec3(0, -20, 0),
		})
		const groundPhysicMaterial = new CANNON.Material('slippery'); // new CANNON.Material('slippery')
		const groundBody = new CANNON.Body({
			mass: 0,
			material: groundPhysicMaterial,
			shape: new CANNON.Plane(),
		})
		groundBody.quaternion.setFromAxisAngle( new CANNON.Vec3( 1, 0, 0 ), -Math.PI / 2 )
		this.world.world.addBody(groundBody);
		const radius = 5;
		let sphere: Sphere = {
			radius: radius,
			body: new CANNON.Body({
				mass: 5,
				shape: new CANNON.Sphere(radius),
			}),
		};
		sphere.body.position.set(0, 10, 0)
		this.world.world.addBody(sphere.body);
		this.world.balls = new Array<Sphere>();
		this.world.balls.push(sphere);
		this.data.balls = new Array<Ball>();
		this.data.balls.push({position: [sphere.body.position.x, sphere.body.position.y, sphere.body.position.z], size: radius});
	
		this.world.players = new Map<number, Paddle>();
		this.data.players = new Array<PlayerBody>();
		const playerSpawnPos = [[0, 2, 50], [0, 2, -50], [50, 2, 0], [50, 2, 0]]
		let i: number = 0;
		this.lobby.players.forEach((elem) => {
			const paddleSize:[number, number, number] = [12, 3, 2];
			const playerPhysicMaterial = new CANNON.Material('slippery');
			const paddle: Paddle = {
				size: paddleSize,
				body: new CANNON.Body({
						mass: 5,
						shape: new CANNON.Box(new CANNON.Vec3(paddleSize[0] / 2, paddleSize[1] / 2, paddleSize[2] / 2)),
						material: playerPhysicMaterial,
						linearDamping: 0,
						angularDamping: 1.0,
					}),
				player: elem,
				acceleration: new CANNON.Vec3(),
				previousVelocity: new CANNON.Vec3(),
				lastMovement: null,
			}
			paddle.body.quaternion.setFromEuler(0, i % 2  ? Math.PI : 0, 0);
			paddle.body.position.set(playerSpawnPos[i][0], playerSpawnPos[i][1], playerSpawnPos[i][2]); // Position du joueur 1
			const groundPlayerContactMaterial = new CANNON.ContactMaterial(groundPhysicMaterial, playerPhysicMaterial, {
				friction: 0.1,
			});
			this.world.world.addBody(paddle.body);
			this.world.world.addContactMaterial(groundPlayerContactMaterial);
			this.world.players.set(elem.id, paddle);
			paddle.body.addEventListener('collide', this.collision);
			this.data.players.push({position: [paddle.body.position.x, paddle.body.position.y, paddle.body.position.z], size: paddleSize, id: elem.id, quaternion: paddle.body.quaternion, team: elem.team});
			elem.team = i % 2 ? 'home' : 'visitor';
			console.log(elem.team);
			i++;
		});
	
	}

	clear() {
		delete this.world.balls;
		delete this.world.players;
		delete this.world.groundBody;
		delete this.world;
		clearInterval(this.interval);
	}

	dispatchGameState() {
		const payload: ServerPayloads[ServerEvents.GameState] = {
			scores: this.scores,
			gameData: this.data,
		}
		this.lobby.emit<ServerPayloads[ServerEvents.GameState]>(ServerEvents.GameState, payload);
	}

	copyData() {
		let i: number = 0;
		this.world.balls.forEach((ball) => {
			this.data.balls[i++] = {position: [ball.body.position.x, ball.body.position.y, ball.body.position.z], size: ball.radius}
		})
		i = 0
		this.world.players.forEach((player) => {
			this.data.players[i++] = {position: [player.body.position.x, player.body.position.y, player.body.position.z], size: player.size, id: player.player.id, quaternion: player.body.quaternion, team: player.player.team};
		})
	}


	animate() {
		//requestAnimationFrame(this.animate)
		this.interval = setInterval(() => {
			this.world.world.fixedStep(1/60);
			this.copyData();
			this.world.players.forEach((e) => {
				e.body.velocity.y = 0;
			})
			this.dispatchGameState();
		}, 1000/ 60);
	  }

	gameLogic() {
		// All game Logic.
		this.animate();
	}

}