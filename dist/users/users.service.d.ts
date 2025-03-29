import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { DatabaseService } from 'src/database/database.service';
export declare class UsersService {
    private prisma;
    constructor(prisma: DatabaseService);
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
    update(id: number, updateUserDto: UpdateUserDto): Promise<{
        email: string;
        isActive: boolean;
        role: import(".prisma/client").$Enums.Role;
        id: number;
    }>;
    delete(id: number): Promise<{
        id: number;
    }>;
}
