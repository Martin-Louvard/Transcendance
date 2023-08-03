import { CreateChatMessageDto } from './dto/create-chat-message.dto';
import { UpdateChatMessageDto } from './dto/update-chat-message.dto';
import { PrismaService } from 'src/prisma/prisma.service';
export declare class ChatMessagesService {
    private prisma;
    constructor(prisma: PrismaService);
    create(createChatMessageDto: CreateChatMessageDto): import(".prisma/client").Prisma.Prisma__ChatMessageClient<import("@prisma/client/runtime").GetResult<{
        id: number;
        channelId: number;
        senderId: number;
        content: string;
        createdAt: Date;
    }, unknown> & {}, never, import("@prisma/client/runtime").DefaultArgs>;
    findAll(): import(".prisma/client").Prisma.PrismaPromise<(import("@prisma/client/runtime").GetResult<{
        id: number;
        channelId: number;
        senderId: number;
        content: string;
        createdAt: Date;
    }, unknown> & {})[]>;
    findOne(id: number): import(".prisma/client").Prisma.Prisma__ChatMessageClient<import("@prisma/client/runtime").GetResult<{
        id: number;
        channelId: number;
        senderId: number;
        content: string;
        createdAt: Date;
    }, unknown> & {}, never, import("@prisma/client/runtime").DefaultArgs>;
    update(id: number, updateChatMessageDto: UpdateChatMessageDto): string;
    remove(id: number): import(".prisma/client").Prisma.Prisma__ChatMessageClient<import("@prisma/client/runtime").GetResult<{
        id: number;
        channelId: number;
        senderId: number;
        content: string;
        createdAt: Date;
    }, unknown> & {}, never, import("@prisma/client/runtime").DefaultArgs>;
}
