import { Strategy } from 'passport-jwt';
import { DatabaseService } from 'src/database/database.service';
declare const JwtStrategy_base: new (...args: [opt: import("passport-jwt").StrategyOptionsWithRequest] | [opt: import("passport-jwt").StrategyOptionsWithoutRequest]) => Strategy & {
    validate(...args: any[]): unknown;
};
export declare class JwtStrategy extends JwtStrategy_base {
    private prisma;
    constructor(prisma: DatabaseService);
    validate(payload: any): Promise<{
        email: string;
        isActive: boolean;
        role: import(".prisma/client").$Enums.Role;
        id: number;
    }>;
}
export {};
