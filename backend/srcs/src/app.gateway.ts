import { ConnectedSocket, MessageBody, SubscribeMessage, WebSocketGateway, WebSocketServer, OnGatewayConnection, OnGatewayDisconnect } from '@nestjs/websockets';
import { PrismaService } from 'src/prisma/prisma.service';
import { GameService } from './game/game.service';
import { Server, Socket } from 'socket.io';
import { ClientEvents, ClientPayloads, LobbyMode, ServerEvents, ServerPayloads } from './Types';

@WebSocketGateway({ cors: '*'})
export class AppGateway implements OnGatewayConnection, OnGatewayDisconnect {
  constructor(private prisma: PrismaService, private readonly gameService: GameService){}
  @WebSocketServer()
  server: Server;
  connected_users_id: Set<number> = new Set();

  async handleConnection(client: any) {
    // A client has connected
    const newly_connected_user_id = client.handshake.headers.user_id
    if(newly_connected_user_id)
      this.connected_users_id.add(newly_connected_user_id);

      // Notify connected clients of current users
    this.server.emit('connected_users', Array.from(this.connected_users_id));
  }

  async handleDisconnect(client: any) {
    // A client disconnects
    const disconnecting_user_id = client.handshake.headers.user_id
    if(disconnecting_user_id)
      this.connected_users_id.delete(disconnecting_user_id);
    
      // Notify connected clients of current users
    this.server.emit('connected_users', Array.from(this.connected_users_id));
  }

  afterInit(server: Server) {
    return this.gameService.afterInit(server);
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
