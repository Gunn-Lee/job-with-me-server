// src/resumes/resumes.service.ts
import { Injectable } from '@nestjs/common';
import { DatabaseService } from '../database/database.service';
import { S3Service } from '../s3/s3.service';
import { OpenAiService } from '../openai/openai.service';
import { CreateResumeDto } from './dto/create-resume.dto';
import * as fs from 'fs';
import * as util from 'util';
import * as pdf from 'pdf-parse';

const readFile = util.promisify(fs.readFile);

@Injectable()
export class ResumesService {
  constructor(
    private prisma: DatabaseService,
    private s3Service: S3Service,
    private openAiService: OpenAiService,
  ) {}

  async create(file: Express.Multer.File, userId: number) {
    // 1. Upload file to S3
    const key = `resumes/${userId}-${Date.now()}-${file.originalname}`;
    const filePath = await this.s3Service.uploadFile(file, key);
    
    // 2. Extract text from PDF (if it's a PDF)
    let resumeText = '';
    if (file.mimetype === 'application/pdf') {
      const pdfData = await pdf(file.buffer);
      resumeText = pdfData.text;
    } else {
      // Handle other file types or use a third-party service
      // For simplicity, we'll assume it's plain text
      resumeText = file.buffer.toString('utf-8');
    }
    
    // 3. Get summary from OpenAI
    const summary = await this.openAiService.summarizeResume(resumeText);
    
    // 4. Save to database
    const resume = await this.prisma.resume.create({
      data: {
        filePath,
        summary,
        userId,
        isDefault: true,
      },
    });

    // 5. update other resume's isDefault to false
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

  async findAll(userId: number) {
    return this.prisma.resume.findMany({
      where: { userId },
    });
  }

  async findOne(id: number) {
    return this.prisma.resume.findUnique({
      where: { id },
    });
  }

  async remove(id: number) {
    // You might want to delete the file from S3 as well
    return this.prisma.resume.delete({
      where: { id },
    });
  }
}