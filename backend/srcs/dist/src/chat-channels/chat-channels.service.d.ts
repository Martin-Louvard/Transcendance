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
    findAll(): import(".prisma/client").Prisma.PrismaPromise<(import("@prisma/client/runtime").GetResult<{
        id: number;
        ownerId: number;
        password: string;
        channelType: string;
        name: string;
    }, unknown> & {})[]>;
    findOne(id: number): import(".prisma/client").Prisma.Prisma__ChatChannelClient<import("@prisma/client/runtime").GetResult<{
        id: number;
        ownerId: number;
        password: string;
        channelType: string;
        name: string;
    }, unknown> & {}, never, import("@prisma/client/runtime").DefaultArgs>;
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
