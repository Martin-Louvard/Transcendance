import { CreateUserDto } from './create-user.dto';
import { User } from '../entities/user.entity';
declare const UpdateUserDto_base: import("@nestjs/common").Type<Partial<CreateUserDto>>;
export declare class UpdateUserDto extends UpdateUserDto_base {
    twoFAEnabled: boolean;
    victoriesCount: number;
    defeatCount: number;
    rank: string;
    level: number;
    friends: User;
}
export {};
