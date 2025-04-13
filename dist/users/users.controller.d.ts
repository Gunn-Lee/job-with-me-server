import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
export declare class UsersController {
    private readonly usersService;
    constructor(usersService: UsersService);
    findAll(email?: string, isActive?: boolean): Promise<{
        email: string;
        isActive: boolean;
        role: import(".prisma/client").$Enums.Role;
        id: number;
    }[]>;
    findOne(id: number): Promise<{
        email: string;
        isActive: boolean;
        role: import(".prisma/client").$Enums.Role;
        id: number;
    }>;
    create(createUserDto: CreateUserDto): Promise<{
        email: string;
        isActive: boolean;
        role: import(".prisma/client").$Enums.Role;
        id: number;
    }>;
    updateOne(id: number, updateUserDto: UpdateUserDto, req: any): Promise<{
        email: string;
        isActive: boolean;
        role: import(".prisma/client").$Enums.Role;
        id: number;
    }>;
    deleteOne(id: number): Promise<{
        id: number;
    }>;
}
