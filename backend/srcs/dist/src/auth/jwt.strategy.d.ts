import { UsersService } from 'src/users/users.service';
declare const JwtStrategy_base: any;
export declare class JwtStrategy extends JwtStrategy_base {
    private usersService;
    constructor(usersService: UsersService);
    validate(payload: {
        username: string;
    }): Promise<any>;
}
export {};
