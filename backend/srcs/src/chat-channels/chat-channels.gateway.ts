import { MessageBody, SubscribeMessage, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { PrismaService } from 'src/prisma/prisma.service';

@WebSocketGateway({ cors: '*'})
export class ChatChannelsGateway {
  constructor(private prisma: PrismaService){}

  @WebSocketServer()
  server;
  @SubscribeMessage('message')
  async handleMessage(@MessageBody() body: Array<any>): Promise<void> {
    const message = await this.prisma.chatMessage.create({data: {channelId: body[0], senderId: body[1] ,content: body[2]}})
    this.server.emit('message', message);
  }
}
