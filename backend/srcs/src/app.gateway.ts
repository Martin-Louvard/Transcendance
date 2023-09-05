import { ConnectedSocket, MessageBody, OnGatewayConnection, OnGatewayDisconnect, OnGatewayInit, SubscribeMessage, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { PrismaService } from 'src/prisma/prisma.service';
import { GameService } from './game/game.service';
import { Server, Socket } from 'socket.io';
import { ClientEvents, ClientPayloads, LobbyMode, ServerEvents, ServerPayloads, InputPacket } from '@shared/class';
import { JwtService } from '@nestjs/jwt';
import { AppService } from './app.service';
import { LobbyService } from './game/lobby/lobby.service';
import { PlayerService } from './game/player/player.service';
import { FriendsService } from './friends/friends.service';

@WebSocketGateway({ cors: '*' })
export class AppGateway implements OnGatewayConnection, OnGatewayDisconnect, OnGatewayInit {
  constructor(
    private prisma: PrismaService,
    private readonly gameService: GameService,
    private friendService: FriendsService,
    private readonly appService: AppService,
    private readonly lobbyService: LobbyService,
    private readonly playerService: PlayerService
  ) {}

  connected_clients = new Map<number, Socket>();

  @WebSocketServer()
  server: Server;

  handleConnection(client: Socket) {
    this.appService.auth(client);
  }

  afterInit(server: Server) {
    return this.gameService.afterInit(server);
  }

  handleDisconnect(client: Socket) {
    return this.gameService.handleDisconnect(client);
  }

  @SubscribeMessage('automatch')
  autoMatch(@ConnectedSocket() client: Socket, @MessageBody() data: LobbyMode) {
    this.gameService.automatch(client, data);
  }

  @SubscribeMessage(ClientEvents.InputState)
  handleInputState(@ConnectedSocket() client: Socket, @MessageBody() data: InputPacket) {
    const lobbyId = this.playerService.getLobby(client.id)
    this.lobbyService.sendToInstance<InputPacket>(lobbyId, data, client.id);
  }

  @SubscribeMessage(ClientEvents.LobbyState)
  lobbyStateHandling(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: ClientPayloads[ClientEvents.LobbyState],
  ) {
    if (data.leaveLobby) {
      this.gameService.leaveLobby(client);
    }
  }

  @SubscribeMessage('start')
  startMatch(@ConnectedSocket() client: Socket) {
    this.gameService.playerStart(client);
    console.log("to");
  }

  @SubscribeMessage('message')
  async handleMessage(
    @ConnectedSocket() client: Socket,
    @MessageBody() body: Array<any>,
  ): Promise<void> {
    const message = await this.prisma.chatMessage.create({
      data: { channelId: body[0], senderId: body[1], content: body[2] },
    });
    this.server.emit('message', message);
  }

  @SubscribeMessage('read')
  async handleUpdateMessage(
    @ConnectedSocket() client: Socket,
    @MessageBody() body: Array<any>,
  ): Promise<void> {
    const updatedMessage = await this.prisma.chatMessage.update({
      where: { id: body[0] },
      data: { readersId: { push: parseInt(body[3]) } },
    });
    this.server.emit('read', updatedMessage);
  }

  @SubscribeMessage('create_chat')
  async handleCreateChat(
    @ConnectedSocket() client: Socket,
    @MessageBody()
    body: {
      ownerId: number;
      name: string;
      channelType: string;
      password: string;
      participants: number[];
    },
  ): Promise<void> {
    const newChatChannel = await this.prisma.chatChannel.create({
      data: {
        owner: { connect: { id: body.ownerId } },
        admins: { connect: { id: body.ownerId } },
        name: body.name,
        channelType: body.channelType,
        password: body.password,
        participants: {
          connect: body.participants.map((p) => {
            return { id: p };
          }),
        },
      },
    });
    const chatChannel = await this.prisma.chatChannel.findUnique({
      where: { id: newChatChannel.id },
      include: {
        owner: true,
        admins: true,
        messages: true,
        participants: true,
      },
    });
    this.server.emit('create_chat', chatChannel);
  }

  @SubscribeMessage('update_chat')
  async handleUpdateChat(
    @ConnectedSocket() client: Socket,
    @MessageBody() body: { id: number; password: string },
  ): Promise<void> {
    const updatedChatChannel = this.prisma.chatChannel.update({
      where: { id: body[0] },
      data: { password: body[1] },
    });
    const channel = this.prisma.chatChannel.findUnique({
      where: { id: body[0] },
      include: { friendship: true, participants: true },
    });
    this.server.emit('update_chat', channel);
  }

  @SubscribeMessage('friend_request')
  async handleNewFriendRequest(
    @ConnectedSocket() client: Socket,
    @MessageBody() body: Array<any>,
  ): Promise<void> {
    if (client.handshake.auth) {
      const user_id_string = client.handshake.auth.user_id;
      const user_id = parseInt(user_id_string);
      const friend = await this.prisma.user.findUnique({
        where: { username: body[1] },
      });
      const friend_id = friend?.id;
      let friendship = await this.friendService.friendshipExists(
        user_id,
        friend_id,
      );
      if (
        friendship &&
        friendship.status === 'BLOCKED' &&
        user_id !== friendship.sender_id
      )
        return;
      let update;
      if (body[2]) {
        update = await this.prisma.friends.update({
          where: { id: body[0] },
          data: { status: body[2], sender_id: user_id },
        });
      } else
        update = await this.friendService.create({
          user_id: user_id,
          friend_id: friend_id,
          sender_id: user_id,
          chat_id: 0,
        });
      friendship = await this.friendService.findOne(update.id);
      const chat = await this.prisma.chatChannel.findUnique({
        where: { id: friendship.chat_id },
        include: { friendship: true, messages: true, participants: true },
      });
      const friend_socket = this.connected_clients.get(friend_id);
      client.emit('friend_request', friendship);
      if (body[2] === 'ACCEPTED') client.emit('create_chat', chat);
      else client.emit('update_chat', chat);

      if (friend_socket) {
        friend_socket.emit('friend_request', friendship);
        if (body[2] === 'ACCEPTED') friend_socket.emit('create_chat', chat);
        else friend_socket.emit('update_chat', chat);
      }
    }
  }
}
