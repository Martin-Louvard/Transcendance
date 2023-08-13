import { Timeout } from "@nestjs/schedule";
import { Ball, GameData, LobbyMode, PlayerBody, ServerEvents, ServerPayloads } from "../../Types";
import { Lobby } from "../lobby/lobby.class";
import * as CANNON from 'cannon-es'
import { Player } from "../player/player.class";

interface Sphere {
	radius: number;
	body: CANNON.Body | null;
}

interface Paddle {
	size: [number, number, number],
	body: CANNON.Body | null;
}

interface World {
	world: CANNON.World | null;
	groundBody: CANNON.Body | null;
	players: Paddle[] | null;
	balls: Sphere[] | null;
}


export class Instance {
	constructor(lobby: Lobby) {
		this.lobby = lobby;
		this.id = Instance.nbInstances++;
	}
	lobby: Lobby;
	private static nbInstances: number = 0;
	public id: number = 0;
	private interval;
	hasStarted: boolean = false; // A recuperer dans l'instance
	hasFinished: boolean = false; // A recuperer dans l'instance
	isSuspended: boolean = false; // A recuperer dans l'instance
	scores: {home: number, visitor: number}= {home: 0, visitor: 0}; // A recuperer dans l'instance
	private startTriggered: boolean = false; // Permet de savoir si le Start a deja été trigger pour annuler un start si
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

	triggerStart() {
		this.hasStarted = true;
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

	generate() {
		this.world.world = new CANNON.World({
			gravity: new CANNON.Vec3(0, -9.82, 0), // m/s²
		})
		const groundBody = new CANNON.Body({
			type: CANNON.Body.STATIC, // can also be achieved by setting the mass to 0
			shape: new CANNON.Plane(),
		})
		groundBody.quaternion.setFromEuler(-Math.PI / 2, 0, 0) // make it face up
		this.world.world.addBody(groundBody);
		const radius = 5;
		let sphere: Sphere = {
			radius: radius,
			body: new CANNON.Body({
				mass: 5, // kg
				shape: new CANNON.Sphere(radius),
			}),
		};
		sphere.body.position.set(0, 10, 0) // m
		this.world.world.addBody(sphere.body);
		this.world.balls = new Array<Sphere>();
		this.world.balls.push(sphere);
		this.data.balls = new Array<Ball>();
		this.data.balls.push({position: [sphere.body.position.x, sphere.body.position.y, sphere.body.position.z], size: radius});
	
		this.world.players = new Array<Paddle>();
		this.data.players = new Array<PlayerBody>();
		// [x, y, z] : Y gere la HAUTEUR (donc l'axe non jouable)
		const playerSpawnPos = [[0, 2, 50], [0, 2, -50], [50, 2, 0], [50, 2, 0]]
		for (let index = 0; index < (this.lobby.mode == LobbyMode.duel ? 2 : 4); index++) {
			const paddleSize:[number, number, number] = [12, 3, 2];
			const paddle: Paddle = {
				size: paddleSize,
				body: new CANNON.Body({
						mass: 1, // kg (peut être ajusté)
						shape: new CANNON.Box(new CANNON.Vec3(paddleSize[0] / 2, paddleSize[1] / 2, paddleSize[2] / 2)),
					})
			}
			paddle.body.position.set(playerSpawnPos[index][0], playerSpawnPos[index][1], playerSpawnPos[index][2]); // Position du joueur 1
			this.world.world.addBody(paddle.body);
			this.world.players.push(paddle);
			this.data.players.push({position: [paddle.body.position.x, paddle.body.position.y, paddle.body.position.z], size: paddleSize});

			
		}
	
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
		this.world.balls.forEach((ball) => {
			this.data.balls[0] = {position: [ball.body.position.x, ball.body.position.y, ball.body.position.z], size: ball.radius}
		})
		this.world.players.forEach((player, index) => {
			this.data.players[index] = {position: [player.body.position.x, player.body.position.y, player.body.position.z], size: player.size};
		})
	}

	animate() {
		//requestAnimationFrame(this.animate)
		this.interval = setInterval(() => {
			this.world.world.fixedStep()
			this.copyData();
			this.dispatchGameState();
			//console.log(`[Game] Sphere y position: ${this.world.balls[0].body.position.y}`)

		}, 5);
	  }

	gameLogic() {
		// All game Logic.
		this.animate();
	}

}