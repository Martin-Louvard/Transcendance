import { ConnectedSocket, MessageBody, SubscribeMessage, WebSocketGateway, WebSocketServer, OnGatewayConnection, OnGatewayDisconnect } from '@nestjs/websockets';
import { PrismaService } from 'src/prisma/prisma.service';
import { GameService } from './game/game.service';
import { Server, Socket } from 'socket.io';
import { ClientEvents, ClientPayloads, LobbyMode, ServerEvents, ServerPayloads } from './Types';
import { FriendsService } from './friends/friends.service';

@WebSocketGateway({ cors: '*'})
export class AppGateway implements OnGatewayConnection, OnGatewayDisconnect {
  constructor(private prisma: PrismaService, private readonly gameService: GameService, private friendService: FriendsService){}

  connected_clients = new Map<number, Socket>

  @WebSocketServer()
  server: Server;

  afterInit(server: Server) {
    return this.gameService.afterInit(server);
  }

  handleConnection(client: Socket){
    const user_id = Number(client.handshake.headers.user_id)
    this.connected_clients.set(user_id, client)
    this.prisma.user.update({where: {id: user_id}, data: {status: "ONLINE"}})
    this.server.emit('update_friend_connection_state', {user_id: user_id, status: "ONLINE"})
  }

  handleDisconnect(client: Socket) {
    // Cela fait quitter le lobby du joeur, peut etre pas une bonne idée si 
    // le socket se reset et que le player est tej de son lobby. A voir selon le comportement.
    const user_id = Number(client.handshake.headers.user_id)
    this.connected_clients.delete(user_id)
    this.prisma.user.update({where: {id: user_id}, data: {status: "OFFLINE"}})
    this.server.emit('update_friend_connection_state', {user_id: user_id, status: "OFFLINE"})
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
  async handleMessage(@ConnectedSocket() client: Socket, @MessageBody() body: Array<any>): Promise<void> {
    const message = await this.prisma.chatMessage.create({data: {channelId: body[0], senderId: body[1] ,content: body[2]}})
    this.server.emit('message', message);
  }

  @SubscribeMessage('friend_request')
  async handleNewFriendRequest(@ConnectedSocket() client: Socket, @MessageBody() body: Array<any>): Promise<void> {
      const friend = await this.prisma.user.findUnique({where:{username: body[1]}})
      const friend_id = friend.id;
      const newFriendship = await this.friendService.create({user_id: body[0], friend_id: friend_id, chat_id: 0})
      const friendship = await this.friendService.findOne(newFriendship.id)
      const friend_socket = this.connected_clients.get(friend_id)
      client.emit('friend_request', friendship);
      if (friend_socket)
        friend_socket.emit('friend_request', friendship);
  }

  @SubscribeMessage('update_friend_request')
  async handleUpdateFriendshipStatus(@ConnectedSocket() client: Socket, @MessageBody() body: Array<any>): Promise<void> {
    const friendshipToUpdate = await this.prisma.friends.update({
      where: {id: body[0]},
      data: {status: body[2] }
    })
    const friend_id = Number(body[1])
    const friendship = await this.friendService.findOne(friendshipToUpdate.id)
    const friend_socket = this.connected_clients.get(friend_id)
    client.emit('update_friend_request', friendship);
    if (friend_socket)
      friend_socket.emit('update_friend_request', friendship);
  }
}