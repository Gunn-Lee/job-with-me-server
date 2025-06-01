// src/resumes/resumes.service.ts
import { Injectable } from "@nestjs/common";
import { DatabaseService } from "../database/database.service";
import { S3Service } from "../s3/s3.service";
import { OpenAiService } from "../openai/openai.service";
import * as pdf from "pdf-parse";

@Injectable()
export class ResumesService {
  constructor(
    private prisma: DatabaseService,
    private s3Service: S3Service,
    private openAiService: OpenAiService
  ) {}

  async create(file: Express.Multer.File, userId: number) {
    // Validate file type
    if (!file.buffer) {
      throw new Error("No file buffer: be sure to use multer.memoryStorage()");
    }
    const buffer: Buffer = file.buffer;

    // 1. Upload file to S3
    const key = `resumes/${userId}-${Date.now()}-${file.originalname}`;
    const filePath = await this.s3Service.uploadFile(file, key);

    console.info("resume saved at", filePath);

    // 2. Extract text from PDF (if it's a PDF)
    let resumeText = "";

    if (file.mimetype === "application/pdf") {
      try {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-call
        const pdfData = (await pdf(buffer)) as { text: string };
        resumeText = pdfData.text;
      } catch (error) {
        console.error("Error extracting text from PDF:", error);
        throw new Error("Failed to extract text from PDF");
      }
    } else {
      // Handle other file types or use a third-party service
      throw new Error("Only PDF files are supported");
    }

    // 3. Get summary from OpenAI
    const summary = await this.openAiService.summarizeResume(resumeText);
    
    type ResumeSummary = {
      name?: string;
      email?: string;
      linkedIn?: string;
      education?: Array<{
        degree?: string;
        major?: string;
        institution?: string;
        from?: string;
        to?: string;
      }>;
    experience?: Array<{
        company?: string;
        location?: string;
        position?: string;
        from?: string;
        to?: string;
        description?: string;
      }>;
      skill?: string;
      certification?: string;
      note?: string;
      summary?: string; // This is the brief summary of the resume
    };

    const parsedSummary: ResumeSummary = JSON.parse(summary);
    // console.info("parsed resume summary", parsedSummary);
    
    // 4. Save to database
    const resume = await this.prisma.resume.create({
      data: {
        filePath,
        userId,
        isDefault: true,
        title: file.originalname,
        size: Math.round((file.size * 100) / (1024 * 1024)) / 100, // size in MB(2 decimal)
        name: parsedSummary.name,
        education: parsedSummary.education,
        experience: parsedSummary.experience,
        skill: parsedSummary.skill,
        certification: parsedSummary.certification,
        note: parsedSummary.note,
        summary: parsedSummary.summary,
      },
    });

    // 5. update other resume's isDefault to false
    await this.prisma.resume.updateMany({
      where: {
        userId,
        isDefault: true,
        id: {
          not: resume.id,
        },
      },
      data: {
        isDefault: false,
      },
    });

    return resume;
  }

  async findAll(userId: number) {
    const resumes = await this.prisma.resume.findMany({
      where: { userId, isDeleted: false },
      orderBy: { createdAt: "desc" },
    });

    // console.log("resumes found", resumes);

    return resumes.map((resume) => ({
      ...resume,
      experience: resume.experience || [],
      education: resume.education || [],
      skill: resume.skill?.replace(/"/g, "").split(", ").map((s) => s.trim()) || [], 
      certification: resume.certification?.replace(/"/g, "").split(", ").map((c) => c.trim()) || [],
    }));
  }

  async findOne(id: number) {
    return this.prisma.resume.findUnique({
      where: { id },
    });
  }

  async remove(id: number) {
    return this.prisma.resume.delete({
      where: { id },
    });
  }
}
