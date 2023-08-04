import { CreateChatChannelDto } from './create-chat-channel.dto';
import { User } from 'src/users/entities/user.entity';
declare const UpdateChatChannelDto_base: import("@nestjs/common").Type<Partial<CreateChatChannelDto>>;
export declare class UpdateChatChannelDto extends UpdateChatChannelDto_base {
    bannedUsers: Array<User>;
    participants: Array<User>;
}
export {};
