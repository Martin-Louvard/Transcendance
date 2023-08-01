import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { PrismaService } from 'src/prisma/prisma.service';
export declare const roundsOfHashing = 10;
export declare class UsersService {
    private prisma;
    constructor(prisma: PrismaService);
    create(createUserDto: CreateUserDto): Promise<import("@prisma/client/runtime").GetResult<{
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
    }, unknown> & {}>;
    findAll(): import(".prisma/client").Prisma.PrismaPromise<({
        friends: (import("@prisma/client/runtime").GetResult<{
            id: number;
            user_id: number;
            friend_id: number;
            createdAt: Date;
            updatedAt: Date;
        }, unknown> & {})[];
        games: (import("@prisma/client/runtime").GetResult<{
            id: number;
            gameData: import(".prisma/client").Prisma.JsonValue;
            status: string;
            createdAt: Date;
        }, unknown> & {})[];
        JoinedChatChannels: (import("@prisma/client/runtime").GetResult<{
            id: number;
            ownerId: number;
            password: string;
            channelType: string;
            name: string;
        }, unknown> & {})[];
        OwnedChatChannels: (import("@prisma/client/runtime").GetResult<{
            id: number;
            ownerId: number;
            password: string;
            channelType: string;
            name: string;
        }, unknown> & {})[];
        BannedFromChatChannels: (import("@prisma/client/runtime").GetResult<{
            id: number;
            ownerId: number;
            password: string;
            channelType: string;
            name: string;
        }, unknown> & {})[];
        AdminOnChatChannels: (import("@prisma/client/runtime").GetResult<{
            id: number;
            ownerId: number;
            password: string;
            channelType: string;
            name: string;
        }, unknown> & {})[];
    } & import("@prisma/client/runtime").GetResult<{
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
    }, unknown> & {})[]>;
    findOne(username: string): import(".prisma/client").Prisma.Prisma__UserClient<{
        friends: (import("@prisma/client/runtime").GetResult<{
            id: number;
            user_id: number;
            friend_id: number;
            createdAt: Date;
            updatedAt: Date;
        }, unknown> & {})[];
        games: (import("@prisma/client/runtime").GetResult<{
            id: number;
            gameData: import(".prisma/client").Prisma.JsonValue;
            status: string;
            createdAt: Date;
        }, unknown> & {})[];
        JoinedChatChannels: (import("@prisma/client/runtime").GetResult<{
            id: number;
            ownerId: number;
            password: string;
            channelType: string;
            name: string;
        }, unknown> & {})[];
        OwnedChatChannels: (import("@prisma/client/runtime").GetResult<{
            id: number;
            ownerId: number;
            password: string;
            channelType: string;
            name: string;
        }, unknown> & {})[];
        BannedFromChatChannels: (import("@prisma/client/runtime").GetResult<{
            id: number;
            ownerId: number;
            password: string;
            channelType: string;
            name: string;
        }, unknown> & {})[];
        AdminOnChatChannels: (import("@prisma/client/runtime").GetResult<{
            id: number;
            ownerId: number;
            password: string;
            channelType: string;
            name: string;
        }, unknown> & {})[];
    } & import("@prisma/client/runtime").GetResult<{
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
    }, unknown> & {}, never, import("@prisma/client/runtime").DefaultArgs>;
    findById(id: number): import(".prisma/client").Prisma.Prisma__UserClient<{
        friends: (import("@prisma/client/runtime").GetResult<{
            id: number;
            user_id: number;
            friend_id: number;
            createdAt: Date;
            updatedAt: Date;
        }, unknown> & {})[];
        games: (import("@prisma/client/runtime").GetResult<{
            id: number;
            gameData: import(".prisma/client").Prisma.JsonValue;
            status: string;
            createdAt: Date;
        }, unknown> & {})[];
        JoinedChatChannels: (import("@prisma/client/runtime").GetResult<{
            id: number;
            ownerId: number;
            password: string;
            channelType: string;
            name: string;
        }, unknown> & {})[];
        OwnedChatChannels: (import("@prisma/client/runtime").GetResult<{
            id: number;
            ownerId: number;
            password: string;
            channelType: string;
            name: string;
        }, unknown> & {})[];
        BannedFromChatChannels: (import("@prisma/client/runtime").GetResult<{
            id: number;
            ownerId: number;
            password: string;
            channelType: string;
            name: string;
        }, unknown> & {})[];
        AdminOnChatChannels: (import("@prisma/client/runtime").GetResult<{
            id: number;
            ownerId: number;
            password: string;
            channelType: string;
            name: string;
        }, unknown> & {})[];
    } & import("@prisma/client/runtime").GetResult<{
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
    }, unknown> & {}, never, import("@prisma/client/runtime").DefaultArgs>;
    findBy42Email(email42: string): import(".prisma/client").Prisma.Prisma__UserClient<{
        friends: (import("@prisma/client/runtime").GetResult<{
            id: number;
            user_id: number;
            friend_id: number;
            createdAt: Date;
            updatedAt: Date;
        }, unknown> & {})[];
        games: (import("@prisma/client/runtime").GetResult<{
            id: number;
            gameData: import(".prisma/client").Prisma.JsonValue;
            status: string;
            createdAt: Date;
        }, unknown> & {})[];
        JoinedChatChannels: (import("@prisma/client/runtime").GetResult<{
            id: number;
            ownerId: number;
            password: string;
            channelType: string;
            name: string;
        }, unknown> & {})[];
        OwnedChatChannels: (import("@prisma/client/runtime").GetResult<{
            id: number;
            ownerId: number;
            password: string;
            channelType: string;
            name: string;
        }, unknown> & {})[];
        BannedFromChatChannels: (import("@prisma/client/runtime").GetResult<{
            id: number;
            ownerId: number;
            password: string;
            channelType: string;
            name: string;
        }, unknown> & {})[];
        AdminOnChatChannels: (import("@prisma/client/runtime").GetResult<{
            id: number;
            ownerId: number;
            password: string;
            channelType: string;
            name: string;
        }, unknown> & {})[];
    } & import("@prisma/client/runtime").GetResult<{
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
    }, unknown> & {}, never, import("@prisma/client/runtime").DefaultArgs>;
    update(username: string, updateUserDto: UpdateUserDto): Promise<import("@prisma/client/runtime").GetResult<{
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
    }, unknown> & {}>;
    remove(id: number): import(".prisma/client").Prisma.Prisma__UserClient<import("@prisma/client/runtime").GetResult<{
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
    }, unknown> & {}, never, import("@prisma/client/runtime").DefaultArgs>;
}
