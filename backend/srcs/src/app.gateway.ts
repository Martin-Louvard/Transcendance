import { ConnectedSocket, MessageBody, SubscribeMessage, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { PrismaService } from 'src/prisma/prisma.service';
import { GameService } from './game/game.service';
import { Server, Socket } from 'socket.io';
import { ClientEvents, ClientPayloads, LobbyMode, ServerEvents, ServerPayloads } from './Types';


@WebSocketGateway({ cors: '*'})
export class AppGateway {
  constructor(private prisma: PrismaService, private readonly gameService: GameService){}

  @WebSocketServer()
  server: Server;

  afterInit(server: Server) {
    return this.gameService.afterInit(server);
  }

  handleDisconnect(client: Socket) {
    // Cela fait quitter le lobby du joeur, peut etre pas une bonne idée si 
    // le socket se reset et que le player est tej de son lobby. A voir selon le comportement.
    return this.gameService.handleDisconnect(client);
  }

  @SubscribeMessage('automatch')
  autoMatch(@ConnectedSocket() client: Socket, @MessageBody() data: LobbyMode) {
    this.gameService.automatch(client, data);
  }

  @SubscribeMessage(ClientEvents.LobbyState)
  lobbyStateHandling(@ConnectedSocket() client: Socket, @MessageBody() data: ClientPayloads[ClientEvents.LobbyState]) {
    if (data.leaveLobby) {
      this.gameService.leaveLobby(client);
    }
  }

  @SubscribeMessage('start')
  startMatch(@ConnectedSocket() client: Socket) {
    this.gameService.playerStart(client);
  }

  @SubscribeMessage(ClientEvents.AuthState)
  auth(@ConnectedSocket() client: Socket,@MessageBody() data: ClientPayloads[ClientEvents.AuthState]) {
    
    if (data == undefined)
      return ;
    this.gameService.auth(client, data);
  }

  @SubscribeMessage('message')
  async handleMessage(@MessageBody() body: Array<any>): Promise<void> {
    const message = await this.prisma.chatMessage.create({data: {channelId: body[0], senderId: body[1] ,content: body[2]}})
    this.server.emit('message', message);
  }
}
