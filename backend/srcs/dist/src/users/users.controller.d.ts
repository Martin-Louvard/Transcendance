import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
export declare class UsersController {
    private readonly usersService;
    constructor(usersService: UsersService);
    create(createUserDto: CreateUserDto): Promise<any>;
    findAll(): any;
    findOne(username: string): any;
    findById(id: string): any;
    findBy42Email(email42: string): any;
    addToChannel(): any;
    update(username: string, updateUserDto: UpdateUserDto): Promise<any>;
    remove(id: string): any;
}
