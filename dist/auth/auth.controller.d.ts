import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
export declare class AuthController {
    private authService;
    constructor(authService: AuthService);
    login(loginDto: LoginDto): Promise<{
        access_token: string;
        refresh_token: string;
        user: {
            id: number;
            email: string;
            role: import(".prisma/client").$Enums.Role;
        };
    }>;
    refreshToken(body: {
        refreshToken: string;
    }): Promise<{
        access_token: string;
    }>;
    logout(req: any): Promise<{
        success: boolean;
    }>;
    getProfile(req: any): any;
}
