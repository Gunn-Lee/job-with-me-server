import { ResumesService } from './resumes.service';
export declare class ResumesController {
    private readonly resumesService;
    constructor(resumesService: ResumesService);
    uploadResume(file: Express.Multer.File, req: any): Promise<{
        id: number;
        createdAt: Date;
        updatedAt: Date;
        filePath: string;
        userId: number;
        summary: string | null;
        isDefault: boolean;
    }>;
    findAll(req: any): Promise<{
        id: number;
        createdAt: Date;
        updatedAt: Date;
        filePath: string;
        userId: number;
        summary: string | null;
        isDefault: boolean;
    }[]>;
    findOne(id: number, req: any): Promise<{
        id: number;
        createdAt: Date;
        updatedAt: Date;
        filePath: string;
        userId: number;
        summary: string | null;
        isDefault: boolean;
    } | null>;
    remove(id: number, req: any): Promise<{
        id: number;
        createdAt: Date;
        updatedAt: Date;
        filePath: string;
        userId: number;
        summary: string | null;
        isDefault: boolean;
    }>;
}
