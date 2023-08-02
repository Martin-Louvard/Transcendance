import { CreateChatChannelDto } from './dto/create-chat-channel.dto';
import { UpdateChatChannelDto } from './dto/update-chat-channel.dto';
import { PrismaService } from 'src/prisma/prisma.service';
export declare class ChatChannelsService {
    private prisma;
    constructor(prisma: PrismaService);
    create(createChatChannelDto: CreateChatChannelDto): any;
    findAll(): any;
    findOne(id: number): any;
    update(id: number, updateChatChannelDto: UpdateChatChannelDto): any;
    remove(id: number): any;
}
