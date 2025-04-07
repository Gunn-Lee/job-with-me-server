import { JwtService } from "@nestjs/jwt";
import { DatabaseService } from "src/database/database.service";
import { LoginDto } from "./dto/login.dto";
import { RegisterDto } from "./dto/register.dto";
export declare class AuthService {
    private prisma;
    private jwtService;
    constructor(prisma: DatabaseService, jwtService: JwtService);
    register(registerDto: RegisterDto): Promise<{
        access_token: string;
        refresh_token: string;
        user: {
            id: number;
            email: string;
            role: import(".prisma/client").$Enums.Role;
        };
    }>;
    login(loginDto: LoginDto): Promise<{
        access_token: string;
        refresh_token: string;
        user: {
            id: number;
            email: string;
            role: import(".prisma/client").$Enums.Role;
        };
    }>;
    refreshToken(refreshToken: string): Promise<{
        access_token: string;
    }>;
    logout(userId: number): Promise<{
        success: boolean;
    }>;
}
