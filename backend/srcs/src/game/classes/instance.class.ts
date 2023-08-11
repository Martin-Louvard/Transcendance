import { Timeout } from "@nestjs/schedule";
import { GameData, ServerEvents, ServerPayloads } from "../../Types";
import { Lobby } from "../lobby/lobby.class";
import * as CANNON from 'cannon-es'
import { Player } from "../player/player.class";

interface Sphere {
	radius: number;
	body: CANNON.Body | null;
}

interface World {
	world: CANNON.World | null;
	groundBody: CANNON.Body | null;
	players: Player[] | null;
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
		mapHeight:  20,
		mapWidth: 20,
		ballPosition: [0, 0, 0],
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
		this.world.players = new Array<Player>();
		this.lobby.players.forEach((player) => { // On copie tout les players du lobby dans ce tableau
			this.world.players.push(player);
		})
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

		let sphere: Sphere = {
			radius: 4,
			body: new CANNON.Body({
				mass: 5, // kg
				shape: new CANNON.Sphere(4),
			}),
		};
		sphere.body.position.set(0, 10, 0) // m
		this.world.world.addBody(sphere.body);
		this.world.balls = new Array<Sphere>();
		this.world.balls.push(sphere);
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

	animate() {
		//requestAnimationFrame(this.animate)
		this.interval = setInterval(() => {
			this.world.world.fixedStep()
			this.data.ballPosition = [this.world.balls[0].body.position.x, this.world.balls[0].body.position.y, this.world.balls[0].body.position.z];
			this.dispatchGameState();
			console.log(`[Game] Sphere y position: ${this.world.balls[0].body.position.y}`)

		}, 500);
	  }

	gameLogic() {
		// All game Logic.
		this.animate();
	}

}