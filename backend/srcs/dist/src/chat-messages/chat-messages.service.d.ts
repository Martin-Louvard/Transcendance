import { CreateChatMessageDto } from './dto/create-chat-message.dto';
import { UpdateChatMessageDto } from './dto/update-chat-message.dto';
import { PrismaService } from 'src/prisma/prisma.service';
export declare class ChatMessagesService {
    private prisma;
    constructor(prisma: PrismaService);
    create(createChatMessageDto: CreateChatMessageDto): any;
    findAll(): any;
    findOne(id: number): any;
    update(id: number, updateChatMessageDto: UpdateChatMessageDto): string;
    remove(id: number): any;
}
