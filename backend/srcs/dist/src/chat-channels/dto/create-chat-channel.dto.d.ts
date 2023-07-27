import { User } from 'src/users/entities/user.entity';
export declare class CreateChatChannelDto {
    owner: User;
    password: string;
    channelType: string;
    name: string;
    participants: User;
}
