import { User } from 'src/users/entities/user.entity';
export declare class CreateChatChannelDto {
    ownerId: number;
    owner_username: string;
    password: string;
    channelType: string;
    name: string;
    bannedUsers: Array<User>;
    participants: Array<User>;
}
