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
    findAll(): import(".prisma/client").Prisma.PrismaPromise<(import("@prisma/client/runtime").GetResult<{
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
