import { ChatMessagesService } from './chat-messages.service';
import { CreateChatMessageDto } from './dto/create-chat-message.dto';
import { UpdateChatMessageDto } from './dto/update-chat-message.dto';
export declare class ChatMessagesController {
    private readonly chatMessagesService;
    constructor(chatMessagesService: ChatMessagesService);
    create(createChatMessageDto: CreateChatMessageDto): any;
    findAll(): any;
    findOne(id: string): any;
    update(id: string, updateChatMessageDto: UpdateChatMessageDto): string;
    remove(id: string): any;
}
