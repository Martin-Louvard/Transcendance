import { ChatChannelsService } from './chat-channels.service';
import { CreateChatChannelDto } from './dto/create-chat-channel.dto';
import { UpdateChatChannelDto } from './dto/update-chat-channel.dto';
export declare class ChatChannelsController {
    private readonly chatChannelsService;
    constructor(chatChannelsService: ChatChannelsService);
    create(createChatChannelDto: CreateChatChannelDto): any;
    findAll(): any;
    findOne(id: string): any;
    update(id: string, updateChatChannelDto: UpdateChatChannelDto): any;
    remove(id: string): any;
}
