import { ChatChannel } from 'src/chat-channels/entities/chat-channel.entity';
import { User } from 'src/users/entities/user.entity';
export declare class CreateChatMessageDto {
    channel: ChatChannel;
    sender: User;
    content: string;
}
