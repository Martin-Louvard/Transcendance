import {
  ConnectedSocket,
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { PrismaService } from 'src/prisma/prisma.service';
import { GameService } from './game/game.service';
import { Server, Socket } from 'socket.io';
import { ClientEvents, ClientPayloads, LobbyMode } from './Types';
import { FriendsService } from './friends/friends.service';
import * as bcrypt from 'bcrypt';
export const roundsOfHashing = 10;

@WebSocketGateway({ cors: '*' })
export class AppGateway implements OnGatewayConnection, OnGatewayDisconnect {
  constructor(
    private prisma: PrismaService,
    private readonly gameService: GameService,
    private friendService: FriendsService,
  ) {}

  connected_clients = new Map<number, Socket>();

  @WebSocketServer()
  server: Server;

  afterInit(server: Server) {
    return this.gameService.afterInit(server);
  }

  async handleConnection(client: Socket) {
    if (client.handshake.headers.user_id) {
      const user_id_string = client.handshake.headers.user_id[0];
      const user_id = parseInt(user_id_string);
      this.connected_clients.set(user_id, client);
      this.server.emit('update_friend_connection_state', {
        user_id: user_id,
        status: 'ONLINE',
      });
      await this.prisma.user.update({
        where: { id: user_id },
        data: { status: 'ONLINE' },
      });
    }
  }

  async handleDisconnect(client: Socket) {
    if (client.handshake.headers.user_id) {
      const user_id_string = client.handshake.headers.user_id[0];
      const user_id = parseInt(user_id_string);
      this.connected_clients.delete(user_id);
      this.server.emit('update_friend_connection_state', {
        user_id: user_id,
        status: 'OFFLINE',
      });
      await this.prisma.user.update({
        where: { id: user_id },
        data: { status: 'OFFLINE' },
      });
    }

    // Cela fait quitter le lobby du joeur, peut etre pas une bonne idée si
    // le socket se reset et que le player est tej de son lobby. A voir selon le comportement.
    return this.gameService.handleDisconnect(client);
  }

  @SubscribeMessage('automatch')
  autoMatch(@ConnectedSocket() client: Socket, @MessageBody() data: LobbyMode) {
    this.gameService.automatch(client, data);
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
  }

  @SubscribeMessage(ClientEvents.AuthState)
  auth(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: ClientPayloads[ClientEvents.AuthState],
  ) {
    if (data == undefined) return;
    this.gameService.auth(client, data);
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
      data: { readersId: { push: parseInt(body[1]) } },
    });
    this.server.emit('read', updatedMessage);
  }

  @SubscribeMessage('join_chat')
  async handleJoinChat(
    @ConnectedSocket() client: Socket,
    @MessageBody() body: Array<any>,
  ): Promise<void> {
    const newUser = await this.prisma.user.findUnique({
      where: { id: body[0] },
    });
    const updatedChats = await this.prisma.chatChannel.update({
      where: { id: body[1] },
      data: { participants: { connect: { id: newUser.id } } },
      include: {
        participants: true,
      },
    });
    this.server.emit('join_chat', updatedChats);
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

    const hashedPassword = await bcrypt.hash(
      body.password,
      roundsOfHashing,
    );
    const newChatChannel = await this.prisma.chatChannel.create({
      data: {
        owner: { connect: { id: body.ownerId } },
        admins: { connect: { id: body.ownerId } },
        name: body.name,
        channelType: body.channelType,
        password: hashedPassword,
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
    if (client.handshake.headers.user_id) {
      const user_id_string = client.handshake.headers.user_id[0];
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
