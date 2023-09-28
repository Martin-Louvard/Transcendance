import { Timeout } from "@nestjs/schedule";
import { Ball, GameData, LobbyMode, PlayerBody, ServerEvents, ServerPayloads, InputPacket, PlayerInfo, GameParameters, World, Sphere, Paddle} from "@shared/class";
import { Lobby } from "../lobby/lobby.class";
import * as CANNON from 'cannon-es'
import { Player } from "../player/player.class";
import { Injectable } from "@nestjs/common";
import { findNearest, recalculateBallAngle } from "./classicInstance";

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
	private accelerationRate = 50;
	private maxAcceleration = 5000;
	private rotationSpeed;
	automatch: boolean = true;
	private playerSpawnPos;
	private params: GameParameters = {
		classic: false,
		duel: false,
		map: {
			size:[100, 200],
			goalSize: 50,
			medianOffset: 20,
		},
		ball: {
			globalSpeed: 20,
			reboundForce: 20,
			ballAcceleration: 20,
			rotationForce: 20,
		},
		players: {
			speed: 60,
			rotationSpeed: 50,
			boostForce: 20,
			paddleSize: [12, 3, 2],
		},
		general: {
			time: 180,
		}
	};

	// un player quitte pendant le temps d'attente du demarage
	public data: GameData = {
		mapHeight:  200,
		mapWidth: 100,
		balls: null,
		players: null,
		score: {home: 0, visitor: 0},
		elapsedTime: 0,
	};
	private world: World = {
		mapHeight:  200,
		mapWidth: 100,
		world: null,
		groundBody: null,
		players: null,
		balls: null,
		walls: null,
	}
	public contactData = null; // Store the contact data when a collision occurs
	public framesToSmoothCurve = 60 * 180; // Number of frames for the curve effect
	public currentFrame = 0;
	public targetCurveForce = new CANNON.Vec3(0, 0, 0); // Initialize target curve force
	public currentCurveForce = new CANNON.Vec3(0, 0, 0)
	private isRestarting: boolean = false;

	setParams(params: GameParameters) {
		this.params = params;
		this.automatch = false
		this.playerSpawnPos= [[0, 2, params.map.size[1] / 2 - 20], [0, 2, -params.map.size[1] / 2 + 20], [50, 2, params.map.size[1] / 2 - 20], [50, 2, -params.map.size[1] / 2 + 20]]
	};
	getParams(): GameParameters {return this.params};
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
		let infos: PlayerInfo[] = [];
		this.lobby.players.forEach((e) => {
			let info = e.infos;
			infos.push(info);
		})
		this.lobby.players.forEach((e) => {
			const payload: ServerPayloads[ServerEvents.LobbyState] = {
				lobbyId: this.lobby.id,
				mode: this.lobby.mode,
				hasStarted: this.hasStarted,
				hasFinished: this.hasFinished,
				playersCount: this.lobby.nbPlayers,
				isSuspended: this.isSuspended,
				playersInfo: infos,
				winner: null,
				team: e.team,
				score: this.data.score,
			};
			this.lobby.emit<ServerPayloads[ServerEvents.LobbyState]>(ServerEvents.LobbyState, payload);
		})
		this.gameLogic();
	}

	triggerFinish() {
		this.hasFinished = true;
		this.interval.forEach((e) => {
			clearInterval(e);
		})
		this.lobby.players.forEach((e) => {
			const payload: ServerPayloads[ServerEvents.LobbyState] = {
				lobbyId: this.lobby.id,
				mode: this.lobby.mode,
				hasStarted: this.hasStarted,
				hasFinished: this.hasFinished,
				playersCount: this.lobby.nbPlayers,
				isSuspended: this.isSuspended,
				playersInfo: [],
				team: e.team,
				winner: this.data.score.home == this.data.score.visitor ? "draw" : this.data.score.home > this.data.score.visitor ? 'home' : 'visitor', 
				score: this.data.score,
			};
			this.lobby.emit<ServerPayloads[ServerEvents.LobbyState]>(ServerEvents.LobbyState, payload);
			
		})
	}

	triggerFinishSurrender(player: Player) {
		this.hasFinished = true;
		this.interval.forEach((e) => {
			clearInterval(e);
		})
		this.lobby.players.forEach((e) => {
			const payload: ServerPayloads[ServerEvents.LobbyState] = {
				lobbyId: this.lobby.id,
				mode: this.lobby.mode,
				hasStarted: this.hasStarted,
				hasFinished: this.hasFinished,
				playersCount: this.lobby.nbPlayers,
				isSuspended: this.isSuspended,
				playersInfo: [],
				team: e.team,
				winner: player.team == 'visitor' ? 'home' : 'visitor', 
				score: this.data.score,
			};
			this.lobby.emit<ServerPayloads[ServerEvents.LobbyState]>(ServerEvents.LobbyState, payload);
		})
	}

	processInput() {

		let directionVector = new CANNON.Vec3();
		let worldVelocity: CANNON.Vec3 = new CANNON.Vec3();
		let rotationQuaternion = new CANNON.Quaternion();
		let axisY =  new CANNON.Vec3( 0, 1, 0 );
		
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
				rotationQuaternion.setFromAxisAngle(axisY, this.rotationSpeed);
				e.body.quaternion = rotationQuaternion.mult(e.body.quaternion);
			} else if (e.activeDirections.rotRight) {
				rotationQuaternion.setFromAxisAngle(axisY, -this.rotationSpeed);
				e.body.quaternion = rotationQuaternion.mult(e.body.quaternion);
			}
			if (e.activeDirections.boost) {
			}
			// e.body.quaternion.vmult(directionVector, worldVelocity);
			if (e.player.team == 'visitor') {
				e.body.velocity.x = directionVector.x;
				e.body.velocity.z = directionVector.z;
			} else {
				e.body.velocity.x = -directionVector.x;
				e.body.velocity.z = -directionVector.z;
			}
			directionVector.set(0, 0, 0);
		})
	}

	ballPhysics() {
		const minSpeed = this.params.ball.globalSpeed;
		this.world.balls.forEach((e) => {
			e.body.velocity.y = 0;
			e.body.position.y = e.radius;

			if ((e.body.position.x < -(this.params.map.size[0] / 2) || e.body.position.x > (this.params.map.size[0] / 2))
				||
				(e.body.position.z < -(this.params.map.size[1] / 2) || e.body.position.z > (this.params.map.size[1] / 2))
		 		) {
					this.restartRound();
				}
			if (!this.isRestarting) {

				
				const velocityMagnitude = e.body.velocity.length();
				if (velocityMagnitude < minSpeed) {
					const velocityDirection = e.body.velocity.unit();
					e.body.velocity.copy(velocityDirection.scale(minSpeed));
				}
		}
	
		})
	}

	collision(event) {
		const contact: CANNON.ContactEquation = event.contact;

		this.world.balls.forEach((bl) => {
			if (bl.body.id == contact.bi.id) {
				this.world.players.forEach((pl) => {
					if (pl.body.id == contact.bj.id) {
						const collisionNormal = contact.ni;
						const ballVelocityAlongNormal = collisionNormal.dot(bl.body.velocity);
						const newVelocity = bl.body.velocity.vsub(
						  collisionNormal.scale(2 * ballVelocityAlongNormal)
						);
						bl.body.velocity.copy(newVelocity);
						bl.body.angularVelocity.scale(-0.1);
						const impulseStrength = this.params.ball.reboundForce * 2;
						const impulseDirection = new CANNON.Vec3(
						  Math.floor(Math.random() * 2) - 1,
						  0,
						  Math.random()
						);
						let angle = recalculateBallAngle(Math.atan2(impulseDirection.z, impulseDirection.x));
						impulseDirection.normalize();
						const impulseForce = impulseDirection.scale(impulseStrength);
						bl.body.applyImpulse(impulseForce, bl.body.position);
			  
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
					const ballX = ball.body.position.x;
					if (ballX >= -(this.params.map.goalSize / 2) && ballX <= this.params.map.goalSize / 2) {
				if (wall.id == 99) {
					this.data.score.home += 1;
					this.restartRound();
				} else if (wall.id == 100) {
					this.data.score.visitor += 1;
					this.restartRound();
				}
			}
				if (ball && wall) {
					const impactDirection: CANNON.Vec3 = contact.ri.clone();
					let angle = recalculateBallAngle(Math.atan2(impactDirection.z, impactDirection.x));
					const ballSpeed = ball.body.velocity.length();

					const impulseForce = (angle * ballSpeed * this.params.ball.reboundForce) / 100;

					const impulseVector = new CANNON.Vec3(0, 0, impulseForce);
					ball.body.applyImpulse(impulseVector, ball.body.position);

				}
			}
		}
	}

	async timeoutAction(ms, callback) {
		this.isRestarting = true;
		await new Promise(resolve => setTimeout(resolve, ms));
		this.isRestarting = false;
		callback();
	}

	ballStart(ball: Sphere) {
		const direction = new CANNON.Vec3(Math.floor(Math.random() * 2) - 1, 0, Math.random());
		let angle = recalculateBallAngle( Math.atan2(direction.z, direction.x));
		direction.set(Math.cos(angle), 0, Math.sin(angle))
		const impulseStrength = 500; 
		ball.body.applyImpulse(direction.scale(impulseStrength), ball.body.position);
	}

	async restartRound() {
		this.world.balls.forEach((e: Sphere) => {
			e.body.velocity.set(0, 0, 0);
			e.body.position.set(0, 5, 0);
			e.contactVelocity.set(0, 0, 0);
			e.body.force.set(0, 0, 0);
			e.body.angularVelocity.set(0, 0, 0);
			this.timeoutAction(3000, () => this.ballStart(e));
		});
		let i = 0;
		this.world.players.forEach((e) => {
			e.body.position.set(this.playerSpawnPos[i][0], this.playerSpawnPos[i][1], this.playerSpawnPos[i][2]);
			i++;
		})
	}

	createWalls(ballMaterial: CANNON.Material) {
		const wallSize = 2; // Adjust this value as needed
		const wallHeight = 10; // Adjust this value as needed
		this.world.walls = new Array<CANNON.Body>(4);
	
		const wallShapeX = new CANNON.Box(new CANNON.Vec3(this.world.mapWidth / 2, wallHeight / 2, wallSize / 2));
		const wallShapeZ = new CANNON.Box(new CANNON.Vec3(wallSize / 2, wallHeight / 2, this.world.mapHeight / 2));
	
		const wallMaterial = new CANNON.Material();
		const wallLeft = new CANNON.Body({
			mass: 0,
			shape: wallShapeZ,
			material: wallMaterial
		});
		wallLeft.position.set(-this.world.mapWidth / 2 - wallSize / 2, wallHeight / 2, 0);
		this.world.world.addBody(wallLeft);
		this.world.walls.push(wallLeft);
	
		const wallRight = new CANNON.Body({
			mass: 0,
			shape: wallShapeZ,
			material: wallMaterial
		});
		wallRight.position.set(this.world.mapWidth / 2 + wallSize / 2, wallHeight / 2, 0);
		this.world.world.addBody(wallRight);
		this.world.walls.push(wallRight);
	
		const wallTop = new CANNON.Body({
			mass: 0,
			shape: wallShapeX,
			material: wallMaterial,
		});
		wallTop.id = 100;
		wallTop.position.set(0, wallHeight / 2, -this.world.mapHeight / 2 - wallSize / 2);
		this.world.world.addBody(wallTop);
		this.world.walls.push(wallTop);
	
		const wallBottom = new CANNON.Body({
			mass: 0,
			shape: wallShapeX,
			material: wallMaterial
		});
		wallBottom.id = 99;
		wallBottom.position.set(0, wallHeight / 2, this.world.mapHeight / 2 + wallSize / 2);
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
				angularFactor: new CANNON.Vec3(0.4, 0.4, 0.4),
			}),
			contactVelocity: new CANNON.Vec3(0, 0, 0),
		};
		sphere.body.position.set(0, radius, 0)
		this.world.world.addBody(sphere.body);
		this.world.balls = new Array<Sphere>();
		this.world.balls.push(sphere);
		this.data.balls = new Array<Ball>();
		this.data.balls.push({position: [sphere.body.position.x, sphere.body.position.y, sphere.body.position.z], size: radius, quaternion: sphere.body.quaternion});
	}

	createPlayers(groundMaterial: CANNON.Material, ballMaterial: CANNON.Material) {
		this.world.players = new Map<number, Paddle>();
		this.data.players = new Array<PlayerBody>();
		let i: number = 0;
		const paddleSize = this.params.players.paddleSize;
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
			paddle.body.position.set(this.playerSpawnPos[i][0], this.playerSpawnPos[i][1], this.playerSpawnPos[i][2]);
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
		if (this.params) {
			let angleMax = Math.PI / 2 * (1 / 6);
			this.rotationSpeed = (this.params.players.rotationSpeed / 100) * (angleMax);
			this.world.mapWidth = this.params.map.size[0]
			this.world.mapHeight = this.params.map.size[1]
			this.moveDistance = this.params.players.speed;
			this.data.mapWidth = this.params.map.size[0];
			this.data.mapHeight = this.params.map.size[1];
		}
		const groundMaterial: CANNON.Material = new CANNON.Material();
		this.world.world = new CANNON.World({
			gravity: new CANNON.Vec3(0, -20, 0),
		})
		const groundPhysicMaterial = groundMaterial; // new CANNON.Material('slippery')
		const groundBody = new CANNON.Body({
			mass: 0,
			material: groundPhysicMaterial,
			shape: new CANNON.Plane(),
			collisionResponse: false,
		})
		groundBody.quaternion.setFromAxisAngle( new CANNON.Vec3( 1, 0, 0 ), -Math.PI / 2 )
		this.world.world.addBody(groundBody);
		const ballMaterial: CANNON.Material = new CANNON.Material();
		this.createBalls(ballMaterial);
		this.createPlayers(groundMaterial, ballMaterial);
		this.createWalls(ballMaterial);
		this.world.balls.forEach((e) => {
			this.timeoutAction(3000, () => this.ballStart(e));
		})
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
			gameData: this.data,
		}
		this.lobby.emit<ServerPayloads[ServerEvents.GameState]>(ServerEvents.GameState, payload);
	}

	copyData() {
		let i: number = 0;
		this.world.balls.forEach((ball) => {
			this.data.balls[i++] = {position: [ball.body.position.x, ball.body.position.y, ball.body.position.z], size: ball.radius, quaternion: {x: ball.body.quaternion.x, y: ball.body.quaternion.y, z: ball.body.quaternion.z, w: ball.body.quaternion.w}}
		})
		i = 0
		this.world.players.forEach((player) => {
			this.data.players[i++] = {position: [player.body.position.x, player.body.position.y, player.body.position.z], size: player.size, id: player.player.id, quaternion: {x: player.body.quaternion.x, y: player.body.quaternion.y, z: player.body.quaternion.z, w: player.body.quaternion.w}, team: player.player.team};
		})
	}

	playerLogic() {
		this.world.players.forEach((e) => {
			e.body.position.y = e.size[1] / 2;
			if ( (e.player.team == 'home' ? e.body.position.z >= -this.params.map.medianOffset : e.body.position.z <= this.params.map.medianOffset)) {
				e.body.position.z =  (e.player.team == 'home' ? -this.params.map.medianOffset : this.params.map.medianOffset);
			}
			if (e.body.position.z <= -this.world.mapHeight / 2)
				e.body.position.z = -(this.world.mapHeight / 2);
			if (e.body.position.z >= this.world.mapHeight / 2)
				e.body.position.z = this.world.mapHeight / 2;
			if (e.body.position.x <= -this.world.mapWidth / 2)
				e.body.position.x = -(this.world.mapWidth / 2);
			if (e.body.position.x >= this.world.mapWidth / 2)
				e.body.position.x = this.world.mapWidth / 2;  
		})	
	}

	animate() {
		//requestAnimationFrame(this.animate)
		this.interval.push(setInterval(() => {
			this.world.world.step(1/120);
			this.playerLogic();
			this.ballPhysics();
			this.data.elapsedTime = Date.now() / 1000 - this.startTime;
			if (this.data.elapsedTime > this.params.general.time) {
				this.triggerFinish();
			}
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