import { DatabaseService } from '../database/database.service';
import { S3Service } from '../s3/s3.service';
import { OpenAiService } from '../openai/openai.service';
export declare class ResumesService {
    private prisma;
    private s3Service;
    private openAiService;
    constructor(prisma: DatabaseService, s3Service: S3Service, openAiService: OpenAiService);
    create(file: Express.Multer.File, userId: number): Promise<{
        id: number;
        createdAt: Date;
        updatedAt: Date;
        filePath: string;
        userId: number;
        summary: string | null;
        isDefault: boolean;
    }>;
    findAll(userId: number): Promise<{
        id: number;
        createdAt: Date;
        updatedAt: Date;
        filePath: string;
        userId: number;
        summary: string | null;
        isDefault: boolean;
    }[]>;
    findOne(id: number): Promise<{
        id: number;
        createdAt: Date;
        updatedAt: Date;
        filePath: string;
        userId: number;
        summary: string | null;
        isDefault: boolean;
    } | null>;
    remove(id: number): Promise<{
        id: number;
        createdAt: Date;
        updatedAt: Date;
        filePath: string;
        userId: number;
        summary: string | null;
        isDefault: boolean;
    }>;
}
