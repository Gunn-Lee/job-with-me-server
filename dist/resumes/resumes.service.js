"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ResumesService = void 0;
const common_1 = require("@nestjs/common");
const database_service_1 = require("../database/database.service");
const s3_service_1 = require("../s3/s3.service");
const openai_service_1 = require("../openai/openai.service");
const fs = require("fs");
const util = require("util");
const pdf = require("pdf-parse");
const readFile = util.promisify(fs.readFile);
let ResumesService = class ResumesService {
    prisma;
    s3Service;
    openAiService;
    constructor(prisma, s3Service, openAiService) {
        this.prisma = prisma;
        this.s3Service = s3Service;
        this.openAiService = openAiService;
    }
    async create(file, userId) {
        const key = `resumes/${userId}-${Date.now()}-${file.originalname}`;
        const filePath = await this.s3Service.uploadFile(file, key);
        let resumeText = '';
        if (file.mimetype === 'application/pdf') {
            const pdfData = await pdf(file.buffer);
            resumeText = pdfData.text;
        }
        else {
            resumeText = file.buffer.toString('utf-8');
        }
        const summary = await this.openAiService.summarizeResume(resumeText);
        const resume = await this.prisma.resume.create({
            data: {
                filePath,
                summary,
                userId,
                isDefault: true,
            },
        });
        await this.prisma.resume.updateMany({
            where: {
                userId,
                isDefault: true,
            },
            data: {
                isDefault: false,
            },
        });
        return resume;
    }
    async findAll(userId) {
        return this.prisma.resume.findMany({
            where: { userId },
        });
    }
    async findOne(id) {
        return this.prisma.resume.findUnique({
            where: { id },
        });
    }
    async remove(id) {
        return this.prisma.resume.delete({
            where: { id },
        });
    }
};
exports.ResumesService = ResumesService;
exports.ResumesService = ResumesService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [database_service_1.DatabaseService,
        s3_service_1.S3Service,
        openai_service_1.OpenAiService])
], ResumesService);
//# sourceMappingURL=resumes.service.js.map