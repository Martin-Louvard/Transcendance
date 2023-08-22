import { ConnectedSocket, MessageBody, SubscribeMessage, WebSocketGateway, WebSocketServer, OnGatewayConnection, OnGatewayDisconnect } from '@nestjs/websockets';
import { PrismaService } from 'src/prisma/prisma.service';
import { GameService } from './game/game.service';
import { Server, Socket } from 'socket.io';
import { ClientEvents, ClientPayloads, LobbyMode} from './Types';
import { FriendsService } from './friends/friends.service';
import { connect } from 'http2';

@WebSocketGateway({ cors: '*'})
export class AppGateway implements OnGatewayConnection, OnGatewayDisconnect {
  constructor(private prisma: PrismaService, private readonly gameService: GameService, private friendService: FriendsService){}

  connected_clients = new Map<number, Socket>

  @WebSocketServer()
  server: Server;

  afterInit(server: Server) {
    return this.gameService.afterInit(server);
  }

  async handleConnection(client: Socket){
    if (client.handshake.headers.user_id){
      const user_id_string = client.handshake.headers.user_id[0]
      const user_id = parseInt(user_id_string)
      this.connected_clients.set(user_id, client)
      this.server.emit('update_friend_connection_state', {user_id: user_id, status: "ONLINE"})
      await this.prisma.user.update({where: {id: user_id}, data: {status: "ONLINE"}})
    }
  }

  async handleDisconnect(client: Socket) {
    if (client.handshake.headers.user_id){
      const user_id_string = client.handshake.headers.user_id[0]
      const user_id = parseInt(user_id_string)
      this.connected_clients.delete(user_id)
      this.server.emit('update_friend_connection_state', {user_id: user_id, status: "OFFLINE"})
      await this.prisma.user.update({where: {id:user_id}, data: {status: "OFFLINE"}})
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

  @SubscribeMessage('create_chat')
  async handleCreateChat(@ConnectedSocket() client: Socket, @MessageBody() body: {ownerId: number, name: string, channelType: string, password: string, participants: number[]}): Promise<void> {
    const newChatChannel = await this.prisma.chatChannel.create({data: {
      owner: {connect: {id:body.ownerId}}, 
      admins: {connect: {id: body.ownerId}}, 
      name: body.name, 
      channelType: body.channelType, 
      password: body.password, 
      participants: {connect: body.participants.map(p => {return{id: p}})}
    }})
    const chatChannel = await this.prisma.chatChannel.findUnique({
      where: {id: newChatChannel.id},
      include:{
        friendship: true,
        owner: true,
        admins: true,
        messages: true,
        participants: true,
        bannedUsers: true
      }
    })
   this.server.emit('create_chat', chatChannel);
  }

  @SubscribeMessage('update_chat_password')
  async handleUpdateChatPassword(@ConnectedSocket() client: Socket, @MessageBody() body: {chatId: number, channelType:string, password: string}): Promise<void> {
    const user_id_string = client.handshake.headers.user_id[0]
    const user_id = parseInt(user_id_string)
    let channel = await this.prisma.chatChannel.findUnique({where: {id: body.chatId}})
    if (channel.ownerId !== user_id)
      return;
    let update;
    if (body.channelType === "Password")
    update = await this.prisma.chatChannel.update({
      where: {id: body.chatId},
      data: {channelType: body.channelType, password: body.password}
    })
    else
    update = await this.prisma.chatChannel.update({
        where: {id: body.chatId},
        data: {channelType: body.channelType, password: undefined}
      })
    const updatedChannel = await this.prisma.chatChannel.findUnique({
      where: {id: body.chatId},
      include:{
        friendship: true,
        owner: true,
        admins: true,
        messages: true,
        participants: true,
        bannedUsers: true
      }})
    this.server.emit('update_chat_password', updatedChannel);
  }

  @SubscribeMessage('update_chat_admins')
  async handleUpdateChatAdmins(@ConnectedSocket() client: Socket, @MessageBody() body: {chatId: number, userId_to_update: string, actionType: string}): Promise<void> {
    const owner_id_string = client.handshake.headers.user_id[0]
    const owner_id = parseInt(owner_id_string)
    const chat = await this.prisma.chatChannel.findUnique({where: {id: body.chatId}})
    if (chat.ownerId != owner_id)
      return;
    if (body.actionType === "ADD")
      await this.prisma.user.update({
      where: {id: parseInt(body.userId_to_update)}, 
      data: {AdminOnChatChannels: {connect: {id: body.chatId}}}
    })
    else if (body.actionType === "REMOVE")
      await this.prisma.user.update({
      where: {id: parseInt(body.userId_to_update)}, 
      data: {AdminOnChatChannels: {disconnect: {id: body.chatId}}}
    })
    const updatedChannel = await this.prisma.chatChannel.findUnique({
      where: {id: body.chatId},
      include:{
        friendship: true,
        owner: true,
        admins: true,
        messages: true,
        participants: true,
        bannedUsers: true
      }})
    this.server.emit('update_chat_admins', updatedChannel);
  }

  @SubscribeMessage('update_chat_owner')
  async handleUpdateChatOwner(@ConnectedSocket() client: Socket, @MessageBody() body: {chatId: number, new_owner_id: number}): Promise<void> {
    const owner_id_string = client.handshake.headers.user_id[0]
    const owner_id = parseInt(owner_id_string)
    const chat = await this.prisma.chatChannel.findUnique({where: {id: body.chatId}, include:{admins: true, participants: true}})
    let new_owner;
    if (chat.ownerId != owner_id)
      return;
    if (chat.admins.length > 1)
      new_owner = chat.admins.find(a => a.id != chat.ownerId)
    else if (chat.participants.length > 1)
      new_owner = chat.participants.find(a => a.id != chat.ownerId)
    else
      return;
    if (body.new_owner_id)
      new_owner = await this.prisma.user.findUnique({where: {id: body.new_owner_id}})
    
    await this.prisma.chatChannel.update({
      where: {id: body.chatId},
      data: {owner: {connect: new_owner.id}}
    })
    const updatedChannel = await this.prisma.chatChannel.findUnique({
      where: {id: body.chatId},
      include:{
        friendship: true,
        owner: true,
        admins: true,
        messages: true,
        participants: true,
        bannedUsers: true
      }})
    this.server.emit('update_chat_owner', updatedChannel);
  }

  @SubscribeMessage('friend_request')
  async handleNewFriendRequest(@ConnectedSocket() client: Socket, @MessageBody() body: Array<any>): Promise<void> {
    if (client.handshake.headers.user_id){
      const user_id_string = client.handshake.headers.user_id[0]
      const user_id = parseInt(user_id_string)
      const friend = await this.prisma.user.findUnique({where:{username: body[1]}})
      const friend_id = friend?.id;
      let friendship = await this.friendService.friendshipExists(user_id, friend_id)
      if (friendship && friendship.status === "BLOCKED" && user_id !== friendship.sender_id)
        return
      let update;
      if (body[2]){
        update = await this.prisma.friends.update({
          where: {id: body[0]},
          data: {status: body[2], sender_id: user_id}
        })
      }
      else
        update = await this.friendService.create({user_id: user_id, friend_id: friend_id, sender_id: user_id, chat_id: 0})
      friendship = await this.friendService.findOne(update.id)
      const chat = await this.prisma.chatChannel.findUnique({where: {id: friendship.chat_id}, include: {friendship: true, messages: true}})
      const friend_socket = this.connected_clients.get(friend_id)
      client.emit('friend_request', friendship);
      client.emit('update_chat', chat);
      if (friend_socket)
      {
        friend_socket.emit('friend_request', friendship);
        friend_socket.emit('update_chat', chat);
      }
    }
  }
}