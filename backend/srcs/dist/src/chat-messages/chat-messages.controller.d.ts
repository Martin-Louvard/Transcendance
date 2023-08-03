import { ChatMessagesService } from './chat-messages.service';
import { CreateChatMessageDto } from './dto/create-chat-message.dto';
import { UpdateChatMessageDto } from './dto/update-chat-message.dto';
export declare class ChatMessagesController {
    private readonly chatMessagesService;
    constructor(chatMessagesService: ChatMessagesService);
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
    findOne(id: string): import(".prisma/client").Prisma.Prisma__ChatMessageClient<import("@prisma/client/runtime").GetResult<{
        id: number;
        channelId: number;
        senderId: number;
        content: string;
        createdAt: Date;
    }, unknown> & {}, never, import("@prisma/client/runtime").DefaultArgs>;
    update(id: string, updateChatMessageDto: UpdateChatMessageDto): string;
    remove(id: string): import(".prisma/client").Prisma.Prisma__ChatMessageClient<import("@prisma/client/runtime").GetResult<{
        id: number;
        channelId: number;
        senderId: number;
        content: string;
        createdAt: Date;
    }, unknown> & {}, never, import("@prisma/client/runtime").DefaultArgs>;
}
