import { CreateChatChannelDto } from './dto/create-chat-channel.dto';
import { UpdateChatChannelDto } from './dto/update-chat-channel.dto';
import { PrismaService } from 'src/prisma/prisma.service';
export declare class ChatChannelsService {
    private prisma;
    constructor(prisma: PrismaService);
    create(createChatChannelDto: CreateChatChannelDto): Promise<import("@prisma/client/runtime").GetResult<{
        id: number;
        ownerId: number;
        password: string;
        channelType: string;
        name: string;
    }, unknown> & {}>;
    findAll(): Promise<({
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
    } & import("@prisma/client/runtime").GetResult<{
        id: number;
        ownerId: number;
        password: string;
        channelType: string;
        name: string;
    }, unknown> & {})[]>;
    findOne(id: number): Promise<{
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
    } & import("@prisma/client/runtime").GetResult<{
        id: number;
        ownerId: number;
        password: string;
        channelType: string;
        name: string;
    }, unknown> & {}>;
    update(id: number, updateChatChannelDto: UpdateChatChannelDto): Promise<import("@prisma/client/runtime").GetResult<{
        id: number;
        ownerId: number;
        password: string;
        channelType: string;
        name: string;
    }, unknown> & {}>;
    remove(id: number): import(".prisma/client").Prisma.Prisma__ChatChannelClient<import("@prisma/client/runtime").GetResult<{
        id: number;
        ownerId: number;
        password: string;
        channelType: string;
        name: string;
    }, unknown> & {}, never, import("@prisma/client/runtime").DefaultArgs>;
}
