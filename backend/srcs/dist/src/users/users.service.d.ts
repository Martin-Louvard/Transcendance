import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { PrismaService } from 'src/prisma/prisma.service';
export declare const roundsOfHashing = 10;
export declare class UsersService {
    private prisma;
    constructor(prisma: PrismaService);
    create(createUserDto: CreateUserDto): Promise<any>;
    findAll(): any;
    findOne(username: string): any;
    findById(id: number): any;
    findBy42Email(email42: string): any;
    update(username: string, updateUserDto: UpdateUserDto): Promise<any>;
    remove(id: number): any;
}
