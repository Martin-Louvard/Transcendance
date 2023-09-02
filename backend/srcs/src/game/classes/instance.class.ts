import { Timeout } from "@nestjs/schedule";
import { Ball, GameData, LobbyMode, PlayerBody, ServerEvents, ServerPayloads, InputPacket} from "@shared/class";
import { Lobby } from "./lobby.class";
import * as CANNON from 'cannon-es'
import { Player } from "../player/player.class";

interface Sphere {
	radius: number;
	body: CANNON.Body | null;
	contactVelocity: CANNON.Vec3;
}

interface Paddle {
	size: [number, number, number],
	acceleration: CANNON.Vec3,
	body: CANNON.Body | null;
	previousVelocity: CANNON.Vec3;
	player: Player;
	lastMovement: number | null;
 	activeDirections : {
		up: boolean,
		right: boolean,
		down: boolean,
		left: boolean,
		boost: boolean,
		rotRight: boolean,
		rotLeft: boolean,
	};	
}

interface World {
	mapHeight:  number;
	mapWidth: number;
	world: CANNON.World | null;
	groundBody: CANNON.Body | null;
	players: Map<number, Paddle> | null;
	walls: CANNON.Body[] | null;
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
	private interval = new Array();
	private maxPlayer: number;
	hasStarted: boolean = false; // A recuperer dans l'instance
	hasFinished: boolean = false; // A recuperer dans l'instance
	isSuspended: boolean = false; // A recuperer dans l'instance
	scores: {home: number, visitor: number}= {home: 0, visitor: 0}; // A recuperer dans l'instance
	private startTriggered: boolean = false; // Permet de savoir si le Start a deja été trigger pour annuler un start si
	private moveDistance: number = 60; // this could be sended by the host of the game in the game parameter
	private ballContactVelocity: CANNON.Vec3;
	public startTime: number;
	accelerationRate = 50;
	maxAcceleration = 5000;

	// un player quitte pendant le temps d'attente du demarage
	private data: GameData = {
		mapHeight:  100,
		mapWidth: 200,
		balls: null,
		players: null,
		score: {home: 0, visitor: 0},
		elapsedTime: 0,
	};
	private world: World = {
		mapHeight:  100,
		mapWidth: 200,
		world: null,
		groundBody: null,
		players: null,
		balls: null,
		walls: null,
	}


	isInstanceOfInputPacket(object: any): boolean {
		return ('code' in object && 'timestamp' in object);
	}
	processGameData<T extends InputPacket>(data: T) {
		if (this.isInstanceOfInputPacket(data)) {
			const paddle = this.world.players.get(data.id);
			const input: InputPacket = data;

			if (!paddle)
				return undefined; //player dont exist error
			switch (input.code) {
				case 0: // move up
					if (data.pressed)
						paddle.activeDirections.up = true;
					else
						paddle.activeDirections.up = false;
					break ;
				case 1: // move right
					if (data.pressed)
						paddle.activeDirections.right = true;
					else
						paddle.activeDirections.right = false;
					break ;
				case 2: // move down
					if (data.pressed)
						paddle.activeDirections.down = true;
					else
						paddle.activeDirections.down = false;
					break ;
				case 3: //move left
					if (data.pressed)
						paddle.activeDirections.left = true;
					else
						paddle.activeDirections.left = false;
					break ;
				case 4: // boost
					if (data.pressed)
						paddle.activeDirections.boost = true;
					else
						paddle.activeDirections.boost = false;
					break ;
				case 5: // rotate right
					if (data.pressed)
						paddle.activeDirections.rotRight = true;
					else
						paddle.activeDirections.rotRight = false;
					break ;
				case 6: // rotate left
					if (data.pressed)
						paddle.activeDirections.rotLeft = true;
					else
						paddle.activeDirections.rotLeft = false;
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

	processInput() {
		let directionVector = new CANNON.Vec3();
		let worldVelocity: CANNON.Vec3 = new CANNON.Vec3();
		let rotationQuaternion = new CANNON.Quaternion();
		let axisY =  new CANNON.Vec3( 0, 1, 0 );
		let rotateAngle;
		
		this.world.players.forEach((e) => {
			if (e.activeDirections.up) {
				directionVector.z = -this.moveDistance;
			}
			else if (e.activeDirections.down) {
				directionVector.z = this.moveDistance;
			}
			if (e.activeDirections.left) {
				directionVector.x = -this.moveDistance;
			}
			else if (e.activeDirections.right) {
				directionVector.x = this.moveDistance;
			}
			if (e.activeDirections.rotLeft) {
				rotateAngle = Math.PI / 2 * (1 / 12);
				rotationQuaternion.setFromAxisAngle(axisY, rotateAngle);
				e.body.quaternion = rotationQuaternion.mult(e.body.quaternion);
				console.log("left");
			} else if (e.activeDirections.rotRight) {
				rotateAngle = Math.PI / 2 * (1 / 12);
				rotationQuaternion.setFromAxisAngle(axisY, -rotateAngle);
				e.body.quaternion = rotationQuaternion.mult(e.body.quaternion);
				console.log("right");
			}
			if (e.activeDirections.boost) {
				console.log("BOOOOSt");
			}
			e.body.quaternion.vmult(directionVector, worldVelocity);
			e.body.velocity.x = worldVelocity.x;
			e.body.velocity.z = worldVelocity.z;
		})
	}

	ballPhysics() {
		this.world.balls.forEach((e) => {
			e.body.velocity.y = 0;
			e.body.position.y = e.radius;
			//e.body.velocity.vadd(e.contactVelocity, e.body.velocity);
		})
	}

	collision(event) {
		const contact: CANNON.ContactEquation = event.contact;

		this.world.balls.forEach((bl) => {
			if (bl.body.id == contact.bi.id) {
				this.world.players.forEach((pl) => {
					if (pl.body.id == contact.bj.id) {
						console.log("collision")
						const impactDirection: CANNON.Vec3 = contact.ri.clone();
						const angle = Math.atan2(impactDirection.z, impactDirection.x);

						const ballSpeed = bl.body.velocity.length();
						const paddleSpeed = pl.body.velocity.length();
	
						console.log(`ball speed : ${ballSpeed}, paddle speed : ${paddleSpeed}, angle : ${angle}`)
						const impulseForce = (angle * ballSpeed * paddleSpeed) / 1000;
	
						const impulseVector = new CANNON.Vec3(0, 0, impulseForce);
						console.log(impulseVector)
						bl.body.applyImpulse(impulseVector, bl.body.position);
						//const mulVec = new CANNON.Vec3(-0, 0, -0);
						//bl.body.applyImpulse(impactDirection.vmul(mulVec), bl.body.position);
						//mulVec.set(-0.2, 0, -0.2);
						//bl.contactVelocity.copy(impulseVector);
						//impactDirection.vmul(mulVec, bl.contactVelocity);
						//bl.body.velocity.copy(bl.contactVelocity);

					}
				})
			}
		})
	}

	wallCollisions(event) {
		const numContacts = this.world.world.contacts.length;
		for (let i = 0; i <numContacts; i++) {
			const contact = this.world.world.contacts[i];
			const bi = contact.bi;
			const bj = contact.bj;


			if ((this.world.balls.find(ball => ball.body === bi) && this.world.walls.includes(bj)) ||
				(this.world.balls.find(ball => ball.body === bj) && this.world.walls.includes(bi))) {
					const ball = this.world.balls.find(ball => ball.body === bi || ball.body === bj);
					const wall = this.world.walls.find(wall => wall == bj || wall == bi);
				console.log(wall.id);
				if (wall.id == 99) {
					console.log('HOME score 1 point');
					this.data.score.home += 1;
					this.restartRound();
				} else if (wall.id == 100) {
					console.log("VISITOR score 1 point");
					this.data.score.visitor += 1;
					this.restartRound();
				}
				if (ball && wall) {
					const impactDirection: CANNON.Vec3 = contact.ri.clone();
					const angle = Math.atan2(impactDirection.z, impactDirection.x);

					// Calcul de la vitesse de la balle et de la paddle
					const ballSpeed = ball.body.velocity.length();

					console.log(`ball speed : ${ballSpeed}, angle : ${angle}`)
					// Calcul de la force d'impulsion en fonction de l'angle, de la vitesse de la balle et de la vitesse de la paddle
					const impulseForce = (angle * ballSpeed) / 1000;

					// Calcul du vecteur de force d'impulsion
					const impulseVector = new CANNON.Vec3(0, 0, impulseForce);
					console.log(impulseVector)
					// Application de la force d'impulsion à la balle
					ball.body.applyImpulse(impulseVector, ball.body.position);

				}
			}
		}
	}

	restartRound() {
		this.world.balls.forEach((e: Sphere) => {
			e.body.velocity.set(0, 0, 0);
			e.body.position.set(0, 5, 0);
			e.contactVelocity.set(0, 0, 0);
			e.body.force.set(0, 0, 0);
			e.body.angularVelocity.set(0, 0, 0);
		});
	}

	createWalls(ballMaterial: CANNON.Material) {
		const wallSize = 2; // Adjust this value as needed
		const wallHeight = 10; // Adjust this value as needed
		this.world.walls = new Array<CANNON.Body>(4);
	
		const wallShapeX = new CANNON.Box(new CANNON.Vec3(this.world.mapHeight / 2, wallHeight / 2, wallSize / 2));
		const wallShapeZ = new CANNON.Box(new CANNON.Vec3(wallSize / 2, wallHeight / 2, this.world.mapWidth / 2));
	
		const wallMaterial = new CANNON.Material();
		const wallLeft = new CANNON.Body({
			mass: 0,
			shape: wallShapeZ,
			material: wallMaterial
		});
		wallLeft.position.set(-this.world.mapHeight / 2 - wallSize / 2, wallHeight / 2, 0);
		this.world.world.addBody(wallLeft);
		this.world.walls.push(wallLeft);
	
		const wallRight = new CANNON.Body({
			mass: 0,
			shape: wallShapeZ,
			material: wallMaterial
		});
		wallRight.position.set(this.world.mapHeight / 2 + wallSize / 2, wallHeight / 2, 0);
		this.world.world.addBody(wallRight);
		this.world.walls.push(wallRight);
	
		const wallTop = new CANNON.Body({
			mass: 0,
			shape: wallShapeX,
			material: wallMaterial,
		});
		wallTop.id = 100;
		wallTop.position.set(0, wallHeight / 2, -this.world.mapWidth / 2 - wallSize / 2);
		this.world.world.addBody(wallTop);
		this.world.walls.push(wallTop);
	
		const wallBottom = new CANNON.Body({
			mass: 0,
			shape: wallShapeX,
			material: wallMaterial
		});
		wallBottom.id = 99;
		wallBottom.position.set(0, wallHeight / 2, this.world.mapWidth / 2 + wallSize / 2);
		this.world.walls.push(wallBottom);
		this.world.world.addBody(wallBottom);
		const ballContactMaterial: CANNON.ContactMaterial = new CANNON.ContactMaterial(ballMaterial, wallMaterial, {restitution: 1 });
		this.world.world.addContactMaterial(ballContactMaterial);
	
		this.world.world.addEventListener('preStep', this.wallCollisions.bind(this));
	}

	createBalls(ballMaterial: CANNON.Material) {
		const radius = 3;
		let sphere: Sphere = {
			radius: radius,
			body: new CANNON.Body({
				mass: 5,
				shape: new CANNON.Sphere(radius),
				material: ballMaterial,
			}),
			contactVelocity: new CANNON.Vec3(0, 0, 0),
		};
		sphere.body.position.set(0, 5, 0)
		this.world.world.addBody(sphere.body);
		this.world.balls = new Array<Sphere>();
		this.world.balls.push(sphere);
		this.data.balls = new Array<Ball>();
		this.data.balls.push({position: [sphere.body.position.x, sphere.body.position.y, sphere.body.position.z], size: radius, quaternion: sphere.body.quaternion});
	}

	createPlayers(groundMaterial: CANNON.Material, ballMaterial: CANNON.Material) {
		this.world.players = new Map<number, Paddle>();
		this.data.players = new Array<PlayerBody>();
		const playerSpawnPos = [[0, 2, 50], [0, 2, -50], [50, 2, 0], [50, 2, 0]]
		let i: number = 0;
		const paddleSize:[number, number, number] = [12, 3, 2];
		const playerMaterial: CANNON.Material = new CANNON.Material('slippery');
		this.lobby.players.forEach((elem) => {
			const paddle: Paddle = {
				size: paddleSize,
				body: new CANNON.Body({
						mass: 5,
						shape: new CANNON.Box(new CANNON.Vec3(paddleSize[0] / 2, paddleSize[1] / 2, paddleSize[2] / 2)),
						material: playerMaterial,
						linearDamping: 0,
						angularDamping: 1.0,
					}),
				player: elem,
				acceleration: new CANNON.Vec3(),
				previousVelocity: new CANNON.Vec3(),
				lastMovement: null,
				activeDirections: {left:false, right: false, up:false, down: false, boost: false, rotLeft: false, rotRight: false},
			}
			paddle.body.quaternion.setFromEuler(0, i % 2  ? Math.PI : 0, 0);
			paddle.body.position.set(playerSpawnPos[i][0], playerSpawnPos[i][1], playerSpawnPos[i][2]); // Position du joueur 1
			const groundPlayerContactMaterial = new CANNON.ContactMaterial(groundMaterial, playerMaterial, {
				friction: 0.1,
			});
			const ballPlayerContactMaterial = new CANNON.ContactMaterial(ballMaterial, playerMaterial, {
				friction: 0,
				restitution: 1,
			});
			this.world.world.addBody(paddle.body);
			this.world.world.addContactMaterial(groundPlayerContactMaterial);
			this.world.players.set(elem.id, paddle);
			paddle.body.addEventListener('collide', this.collision.bind(this));
			this.data.players.push({position: [paddle.body.position.x, paddle.body.position.y, paddle.body.position.z], size: paddleSize, id: elem.id, quaternion: paddle.body.quaternion, team: elem.team});
			elem.team = i % 2 ? 'home' : 'visitor';
			this.startTime = Date.now() / 1000;
			i++;
		});
	}

	generate() {
		const groundMaterial: CANNON.Material = new CANNON.Material();
		this.world.world = new CANNON.World({
			gravity: new CANNON.Vec3(0, -20, 0),
		})
		const groundPhysicMaterial = groundMaterial; // new CANNON.Material('slippery')
		const groundBody = new CANNON.Body({
			mass: 0,
			material: groundPhysicMaterial,
			shape: new CANNON.Plane(),
		})
		groundBody.quaternion.setFromAxisAngle( new CANNON.Vec3( 1, 0, 0 ), -Math.PI / 2 )
		this.world.world.addBody(groundBody);
		const ballMaterial: CANNON.Material = new CANNON.Material();
		this.createBalls(ballMaterial);
		this.createPlayers(groundMaterial, ballMaterial);
		this.createWalls(ballMaterial);
	}

	clear() {
		delete this.world.balls;
		delete this.world.players;
		delete this.world.groundBody;
		delete this.world;
		this.interval.forEach((e) => {
			clearInterval(e);
		})
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
			this.data.balls[i++] = {position: [ball.body.position.x, ball.body.position.y, ball.body.position.z], size: ball.radius, quaternion: ball.body.quaternion}
		})
		i = 0
		this.world.players.forEach((player) => {
			this.data.players[i++] = {position: [player.body.position.x, player.body.position.y, player.body.position.z], size: player.size, id: player.player.id, quaternion: player.body.quaternion, team: player.player.team};
		})
	}


	animate() {
		//requestAnimationFrame(this.animate)
		this.interval.push(setInterval(() => {
			this.world.world.step(1/120);
			this.world.players.forEach((e) => {
				e.body.position.y = e.size[1] / 2;
			})
			this.ballPhysics();
			this.data.elapsedTime = Date.now() / 1000 - this.startTime;
			if (this.data.elapsedTime > 180)
			this.triggerFinish();
	}, 1000/ 120));
}

sendData() {
	this.interval.push(setInterval(() => {
		this.processInput();
		this.copyData();
		this.dispatchGameState();
		}, 1000 / 60));
	}

	gameLogic() {
		// All game Logic.
		this.animate();
		this.sendData();
	}

}