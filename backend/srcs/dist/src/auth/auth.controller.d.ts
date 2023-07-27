import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
export declare class AuthController {
    private authService;
    constructor(authService: AuthService);
    login({ username, password }: LoginDto): Promise<any>;
    auth42({ code }: {
        code: any;
    }): Promise<any>;
}
