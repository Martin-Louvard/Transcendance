import {
  ConnectedSocket,
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { PrismaService } from 'src/prisma/prisma.service';
import { Server, Socket } from 'socket.io';
import { ClientEvents, ClientPayloads, LobbyMode, ServerEvents, ServerPayloads, InputPacket, GameParameters, PlayerInfo, GameRequest, LobbySlotType } from '@shared/class';
import { JwtService } from '@nestjs/jwt';
import { AppService } from './app.service';
import { LobbyService } from './game/lobby/lobby.service';
import { PlayerService } from './game/player/player.service';
import { FriendsService } from './friends/friends.service';
import * as bcrypt from 'bcrypt';
export const roundsOfHashing = 10;
import { Player } from './game/player/player.class';
import { Logger } from '@nestjs/common';
import { Lobby } from './game/lobby/lobby.class';

@WebSocketGateway({ cors: '*' })
export class AppGateway
  implements OnGatewayConnection, OnGatewayDisconnect, OnGatewayInit
{
  constructor(
    private prisma: PrismaService,
    private friendService: FriendsService,
    private readonly appService: AppService,
    private readonly lobbyService: LobbyService,
    private readonly playerService: PlayerService,
  ) {}

  connected_clients = new Map<number, Socket>();
  private readonly logger = new Logger('AppGateway');

  @WebSocketServer()
  server: Server;

  async handleConnection(client: Socket) {
    if (client.handshake.auth.user_id) {
      const user_id_string = client.handshake.auth.user_id;
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
    this.appService.auth(client);
  }

  afterInit(server: Server) {
    return this.lobbyService.setServer(server);
  }

  async handleDisconnect(client: Socket) {
    if (client.handshake.auth.user_id) {
      const user_id_string = client.handshake.auth.user_id;
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

    const player = this.playerService.getPlayerBySocketId(client.id);
    if (!player) return;
    return this.playerService.disconnectPlayer(player);
  }

  @SubscribeMessage(ClientEvents.KickLobby)
  KickPlayerLobby(@ConnectedSocket() client: Socket, @MessageBody() id: number) {
    const player = this.playerService.getPlayer(id);
    const kicker = this.playerService.getPlayerBySocketId(client.id);
    if (!kicker || !player || !kicker.lobby || !player.lobby || kicker.lobby.owner.id != kicker.id)
      return false;
    const lobby = kicker.lobby;
    lobby.removePlayer(player);
  }

  @SubscribeMessage('automatch')
  autoMatch(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: { mode: LobbyMode; info: PlayerInfo },
  ) {
    const player = this.playerService.getPlayerBySocketId(client.id);
    if (!player || player.socket.id != client.id) {
      if (!player)
        this.logger.log(
          `Automatch failed: Player with id : ${data.info.id} with socketId: ${client.id} does not exist`,
        );
      else
        this.logger.log(
          `Automatch failed: Sender socket id : ${client.id} does not match with registered player socket : ${player.socket.id} `,
        );
      return;
    }
    this.lobbyService.automatch(player, data, this.server);
    this.lobbyService.dispatchEvent();
  }

  @SubscribeMessage('automatchClassic')
  autoMatchClassic(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: { info: PlayerInfo },
  ) {
    const player = this.playerService.getPlayerBySocketId(client.id);
    if (!player || player.socket.id != client.id) {
      if (!player)
        this.logger.log(
          `Automatch failed: Player with id : ${data.info.id} with socketId: ${client.id} does not exist`,
        );
      else
        this.logger.log(
          `Automatch failed: Sender socket id : ${client.id} does not match with registered player socket : ${player.socket.id} `,
        );
      return;
    }
    this.lobbyService.automatchClassic(player, data, this.server);
    this.lobbyService.dispatchEvent();
  }

  @SubscribeMessage(ClientEvents.DeleteGameRequest)
  deleteGameRequest(@ConnectedSocket() client: Socket, @MessageBody() data: GameRequest | number) {
    try {
      if (typeof data === "number") {
        this.playerService.deleteRequests(undefined, data);
        const player = this.playerService.getPlayer(data);
        if (player.lobby) {
          return true;
        }
        const sender = this.playerService.getPlayerBySocketId(client.id);
        if (!sender) {
          return false;
        }
        const lobby = sender.lobby;
        if (!lobby) {
          return false ;
        }
        console.log("before: ", lobby.slots);
        const index = lobby.slots.findIndex((slot) => slot.player.id == data);
        lobby.slots[index].full = false;
        lobby.slots[index].type = LobbySlotType.friend;
        lobby.slots[index].player = undefined;
        lobby.dispatchLobbySlots();
      } else {
        if (!data || !data.sender || !data.sender.id || !data.receiver || !data.receiver.id) {
          return false;
        }
      const receiver = this.playerService.getPlayerById(data.receiver.id);
      const sender = this.playerService.getPlayerById(data.sender.id);
      const current = this.playerService.getPlayerBySocketId(client.id)
      if (!receiver || !sender || !current) {
        return false;
      }
      this.playerService.deleteRequests(undefined, undefined, undefined, data.id);
      const lobby = this.lobbyService.getLobby(data.lobby.id);
      if (!lobby)
        return false;
      let isInLobby = false;
      lobby.players.forEach((e) => {
        if (e.id == receiver.id) {
          isInLobby = true ;
          return ;
        }
      })
      if (!lobby || isInLobby)
        return false;
      const index = lobby.slots.findIndex((slot) => slot.player.id == data.receiver.id);
      lobby.slots[index].full = false;
      lobby.slots[index].type = LobbySlotType.friend;
      lobby.slots[index].player = undefined;
      lobby.dispatchLobbySlots();
      }
    } catch(err) {
      console.log(err);
  }
  }

  @SubscribeMessage(ClientEvents.ListenLobbies)
  AddLobbiesListener(@ConnectedSocket() client: Socket) {
    const player= this.playerService.getPlayerBySocketId(client.id);
    if (!player)
      return ;
    this.lobbyService.addListener(player.id);
    this.lobbyService.dispatchEvent();
  }

  @SubscribeMessage(ClientEvents.StopListenLobbies)
  RemoveLobbiesListener(@ConnectedSocket() client: Socket) {
    const player= this.playerService.getPlayerBySocketId(client.id);
    if (!player)
      return ;
    this.lobbyService.removeListener(player.id);
  }

  @SubscribeMessage(ClientEvents.StartGame)
  handleStart(@ConnectedSocket() client: Socket) {
    const player = this.playerService.getPlayerBySocketId(client.id);
    if (!player) return 'player not found';
    const lobby = player.lobby;
    if (!lobby) return 'lobby not found';
    if (!lobby.full) return 'lobby not full';
    if (!lobby.instance) return 'no lobby instance';
    if (lobby.instance.hasStarted || lobby.instance.hasFinished)
      return 'game cannot be restarted';
    lobby.instance.triggerStart();
    this.lobbyService.dispatchEvent();
  }

  @SubscribeMessage(ClientEvents.InputState)
  handleInputState(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: InputPacket,
  ) {
    const lobby = this.playerService.getLobby(client.id);
    if (lobby)
      this.lobbyService.sendToInstance<InputPacket>(lobby.id, data, client.id);
  }

  @SubscribeMessage(ClientEvents.LobbyState)
  lobbyStateHandling(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: ClientPayloads[ClientEvents.LobbyState],
  ) {
    const player = this.playerService.getPlayerBySocketId(client.id);
    if (!player || player.socket.id != client.id || !player.lobby) return;
    if (data.leaveLobby) {
      this.lobbyService.leaveLobby(player);
    }
  }
  @SubscribeMessage(ClientEvents.LobbySlotsState)
  lobbySlotsHandling(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: ClientPayloads[ClientEvents.LobbySlotsState],
  ) {
    const lobby = this.playerService.getLobby(client.id);
    if (lobby) {
      lobby.setSlots(data);
      lobby.dispatchLobbySlots();
    }
  }

  @SubscribeMessage(ClientEvents.GameSendRequest)
  HandleGameInvitation(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: ClientPayloads[ClientEvents.GameSendRequest],
  ) {
    const player = this.playerService.getPlayerById(data.receiverId);
    if (!player || !player.getIsOnline()) return false;
    this.lobbyService.invitePlayer(player, data);
  }

  @SubscribeMessage(ClientEvents.JoinLobby)
  JoinLobby(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: { lobbyId: string; info: PlayerInfo },
  ) {
    const player = this.playerService.getPlayerBySocketId(client.id);
    console.log(data);
    if (!player){ console.log("player not found"); return 'player not found';}
    if (!this.lobbyService.joinLobby(player, data)) return 'cant join lobby';
    this.lobbyService.dispatchEvent();
  }

  @SubscribeMessage(ClientEvents.CreateLobby)
  createLobby(@ConnectedSocket() client: Socket, @MessageBody() data: ClientPayloads[ClientEvents.CreateLobby]) {
    console.log("bonjour");
    const player = this.playerService.getPlayer(data.id);
    if (!player || player.lobby) 
      return ;
    console.log("ici");
    this.lobbyService.createLobby(undefined, this.server, player);
    this.lobbyService.dispatchEvent();
  }

  @SubscribeMessage(ClientEvents.ParameterState)
  SetParameter(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: { params: GameParameters; info: PlayerInfo },
  ) {
    const player = this.playerService.getPlayerBySocketId(client.id);
    if (!player || !player.lobby || player.lobby.owner.id != player.id) // si il est deja dans un lobby on l'autorise pas
      return ;
    player.infos = data.info;
    let dispatch = false;
    if ((data.params.duel && player.lobby.mode == LobbyMode.double )|| (!data.params.duel && player.lobby.mode == LobbyMode.duel) || !player.lobby.mode )
      dispatch = true;
    player.lobby.setParams(data.params);
    
    if (dispatch){ this.lobbyService.dispatchEvent(); console.log("dispatchol")}
    //this.lobbyService.createLobbyByParameters(data.params, this.server, player);
  }

  @SubscribeMessage('message')
  async handleMessage(
    @ConnectedSocket() client: Socket,
    @MessageBody() body: Array<any>,
  ): Promise<void> {
    const message = await this.prisma.chatMessage.create({
      data: { channelId: body[0], senderId: body[1], content: body[2] },
      include: { sender: true },
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
      include: { sender: true },
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
        owner: true,
        admins: true,
        messages: { include: { sender: true } },
        participants: true,
      },
    });
    this.server.emit('join_chat', updatedChats);
  }

  @SubscribeMessage('add_admin')
  async handleAddAdmin(
    @ConnectedSocket() client: Socket,
    @MessageBody() body: Array<any>,
  ): Promise<void> {
    const newAdmin = await this.prisma.user.findUnique({
      where: { id: parseInt(body[1]) },
    });
    const updatedChats = await this.prisma.chatChannel.update({
      where: { id: parseInt(body[0]) },
      data: { admins: { connect: { id: newAdmin.id } } },
      include: {
        owner: true,
        admins: true,
        messages: { include: { sender: true } },
        participants: true,
      },
    });
    this.server.emit('add_admin', updatedChats);
  }

  @SubscribeMessage('leave_chat')
  async handleLeaveChat(
    @ConnectedSocket() client: Socket,
    @MessageBody() body: Array<any>,
  ): Promise<void> {
    const chatRecv = await this.prisma.chatChannel.findUnique({
      where: { id: parseInt(body[0]) },
      include: { participants: true },
    });

    const updatedParticipants = chatRecv.participants.filter(
      (user) => user.id !== parseInt(body[1]),
    );

    const updatedChat = await this.prisma.chatChannel.update({
      where: { id: chatRecv.id },
      data: {
        participants: {
          set: updatedParticipants.map((user) => ({ id: user.id })),
        },
      },
      include: {
        owner: true,
        admins: true,
        messages: { include: { sender: true } },
        participants: true,
      },
    });
    this.server.emit('leave_chat', updatedChat);
  }

  @SubscribeMessage('remove_admin')
  async handleRemoveAdmin(
    @ConnectedSocket() client: Socket,
    @MessageBody() body: Array<any>,
  ): Promise<void> {
    const adminToRemove = await this.prisma.user.findUnique({
      where: { id: parseInt(body[1]) },
    });
    const chat = await this.prisma.chatChannel.findUnique({
      where: { id: parseInt(body[0]) },
      include: {
        owner: true,
        admins: true,
        messages: { include: { sender: true } },
        participants: true,
      },
    });
    const updatedAdmins = chat.admins.filter(
      (user) => user.id !== adminToRemove.id,
    );

    const updatedChat = await this.prisma.chatChannel.update({
      where: { id: chat.id },
      data: {
        admins: { set: updatedAdmins.map((user) => ({ id: user.id })) },
      },
      include: {
        owner: true,
        admins: true,
        messages: { include: { sender: true } },
        participants: true,
      },
    });
    this.server.emit('remove_admin', updatedChat);
  }

  @SubscribeMessage('delete_chat')
  async handleRemoveChat(
    @ConnectedSocket() client: Socket,
    @MessageBody() body: Array<any>,
  ): Promise<void> {
    await this.prisma.chatChannel.delete({
      where: { id: parseInt(body[0]) },
    });
    const updatedChats = await this.prisma.chatChannel.findMany({
      include: {
        participants: true,
        bannedUsers: true,
        admins: true,
        messages: { include: { sender: true } },
      },
    });
    this.server.emit('delete_chat', updatedChats);
  }

  @SubscribeMessage('change_owner')
  async handleChangeOwner(
    @ConnectedSocket() client: Socket,
    @MessageBody() body: Array<any>,
  ): Promise<void> {
    const chatId = parseInt(body[0]);
    const newOwnerId = parseInt(body[1]);
    const oldOwner = parseInt(body[2]);

    const chat = await this.prisma.chatChannel.findUnique({
      where: { id: chatId },
      include: {
        owner: true,
        admins: true,
        messages: { include: { sender: true } },
        participants: true,
      },
    });
    const updateParticipants = chat.participants.filter(
      (user) => user.id !== oldOwner,
    );
    const updatedChannel = await this.prisma.chatChannel.update({
      where: { id: chatId },
      data: {
        ownerId: newOwnerId,
        participants: {
          set: updateParticipants.map((user) => ({ id: user.id })),
        },
      },
      include: {
        owner: true,
        admins: true,
        messages: { include: { sender: true } },
        participants: true,
      },
    });
    this.server.emit('change_owner', updatedChannel);
  }

  @SubscribeMessage('kick_user')
  async handleKickUser(
    @ConnectedSocket() client: Socket,
    @MessageBody() body: Array<any>,
  ): Promise<void> {
    const userToKick = await this.prisma.user.findUnique({
      where: { id: parseInt(body[1]) },
    });
    const chat = await this.prisma.chatChannel.findUnique({
      where: { id: parseInt(body[0]) },
      include: {
        owner: true,
        admins: true,
        messages: { include: { sender: true } },
        participants: true,
      },
    });
    const updatedParticipants = chat.participants.filter(
      (user) => user.id !== userToKick.id,
    );
    const updatedAdmins = chat.admins.filter(
      (user) => user.id !== userToKick.id,
    );

    const updatedChat = await this.prisma.chatChannel.update({
      where: { id: chat.id },
      data: {
        participants: {
          set: updatedParticipants.map((user) => ({ id: user.id })),
        },
        admins: { set: updatedAdmins.map((user) => ({ id: user.id })) },
      },
      include: {
        owner: true,
        admins: true,
        messages: { include: { sender: true } },
        participants: true,
      },
    });
    this.server.emit('kick_user', updatedChat);
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
    const hashedPassword = await bcrypt.hash(body.password, roundsOfHashing);
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
        messages: { include: { sender: true } },
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
      include: {
        owner: true,
        admins: true,
        messages: { include: { sender: true } },
        participants: true,
      },
    });
    this.server.emit('update_chat', channel);
  }

  @SubscribeMessage('block_user')
  async handleBlockUser(
    @ConnectedSocket() client: Socket,
    @MessageBody() body: Array<any>,
  ): Promise<void> {
    const friendRecv = await this.friendService.friendshipExists(
      parseInt(body[1]),
      parseInt(body[0]),
    );
    if (friendRecv) {
      const updatedFriend = await this.prisma.friends.update({
        where: { id: friendRecv.id },
        data: { status: 'BLOCKED' },
      });
      this.server.emit('block_user', updatedFriend);
    } else {
      const createdFriendShip = await this.friendService.create({
        user_id: parseInt(body[1]),
        friend_id: parseInt(body[0]),
        sender_id: parseInt(body[1]),
        chat_id: 0,
      });
      const updatedFriend = await this.prisma.friends.update({
        where: { id: createdFriendShip.id },
        data: { status: 'BLOCKED' },
      });
      this.server.emit('block_user', updatedFriend);
    }
  }

  @SubscribeMessage('friend_request')
  async handleNewFriendRequest(
    @ConnectedSocket() client: Socket,
    @MessageBody() body: Array<any>,
  ): Promise<void> {
    if (client.handshake.auth.user_id) {
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
        include: {
          owner: true,
          admins: true,
          messages: { include: { sender: true } },
          participants: true,
        },
      });
      const friendplayer = this.playerService.getPlayerById(friend_id);
      const friend_socket = friendplayer ? friendplayer.socket : undefined;
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
