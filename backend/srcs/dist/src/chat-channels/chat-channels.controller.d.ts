import { ChatChannelsService } from './chat-channels.service';
import { CreateChatChannelDto } from './dto/create-chat-channel.dto';
import { UpdateChatChannelDto } from './dto/update-chat-channel.dto';
export declare class ChatChannelsController {
    private readonly chatChannelsService;
    constructor(chatChannelsService: ChatChannelsService);
    create(createChatChannelDto: CreateChatChannelDto): import(".prisma/client").Prisma.Prisma__ChatChannelClient<import("@prisma/client/runtime").GetResult<{
        id: number;
        ownerId: number;
        password: string;
        channelType: string;
        name: string;
    }, unknown> & {}, never, import("@prisma/client/runtime").DefaultArgs>;
    findAll(): import(".prisma/client").Prisma.PrismaPromise<({
        participants: (import("@prisma/client/runtime").GetResult<{
            id: number;
            username: string;
            email: string;
            email42: string;
            password: string;
            avatar: string;
            twoFAEnabled: boolean;
            status: string;
            victoriesCount: number;
            defeatCount: number;
            rank: string;
            level: number;
            achievements: import(".prisma/client").Prisma.JsonValue;
            createdAt: Date;
        }, unknown> & {})[];
        bannedUsers: (import("@prisma/client/runtime").GetResult<{
            id: number;
            username: string;
            email: string;
            email42: string;
            password: string;
            avatar: string;
            twoFAEnabled: boolean;
            status: string;
            victoriesCount: number;
            defeatCount: number;
            rank: string;
            level: number;
            achievements: import(".prisma/client").Prisma.JsonValue;
            createdAt: Date;
        }, unknown> & {})[];
        admins: (import("@prisma/client/runtime").GetResult<{
            id: number;
            username: string;
            email: string;
            email42: string;
            password: string;
            avatar: string;
            twoFAEnabled: boolean;
            status: string;
            victoriesCount: number;
            defeatCount: number;
            rank: string;
            level: number;
            achievements: import(".prisma/client").Prisma.JsonValue;
            createdAt: Date;
        }, unknown> & {})[];
        messages: (import("@prisma/client/runtime").GetResult<{
            id: number;
            channelId: number;
            senderId: number;
            content: string;
            createdAt: Date;
        }, unknown> & {})[];
    } & import("@prisma/client/runtime").GetResult<{
        id: number;
        ownerId: number;
        password: string;
        channelType: string;
        name: string;
    }, unknown> & {})[]>;
    findOne(id: string): import(".prisma/client").Prisma.Prisma__ChatChannelClient<import("@prisma/client/runtime").GetResult<{
        id: number;
        ownerId: number;
        password: string;
        channelType: string;
        name: string;
    }, unknown> & {}, never, import("@prisma/client/runtime").DefaultArgs>;
    update(id: string, updateChatChannelDto: UpdateChatChannelDto): import(".prisma/client").Prisma.Prisma__ChatChannelClient<import("@prisma/client/runtime").GetResult<{
        id: number;
        ownerId: number;
        password: string;
        channelType: string;
        name: string;
    }, unknown> & {}, never, import("@prisma/client/runtime").DefaultArgs>;
    remove(id: string): import(".prisma/client").Prisma.Prisma__ChatChannelClient<import("@prisma/client/runtime").GetResult<{
        id: number;
        ownerId: number;
        password: string;
        channelType: string;
        name: string;
    }, unknown> & {}, never, import("@prisma/client/runtime").DefaultArgs>;
}
