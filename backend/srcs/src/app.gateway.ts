import { MessageBody, SubscribeMessage, WebSocketGateway, WebSocketServer, OnGatewayConnection, OnGatewayDisconnect } from '@nestjs/websockets';
import { PrismaService } from 'src/prisma/prisma.service';

@WebSocketGateway({ cors: '*'})
export class AppGateway implements OnGatewayConnection, OnGatewayDisconnect {
  constructor(private prisma: PrismaService){}
  @WebSocketServer()
  server;

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

  @SubscribeMessage('message')
  async handleMessage(@MessageBody() body: Array<any>): Promise<void> {
    const message = await this.prisma.chatMessage.create({data: {channelId: body[0], senderId: body[1] ,content: body[2]}})
    this.server.emit('message', message);
  }
}
