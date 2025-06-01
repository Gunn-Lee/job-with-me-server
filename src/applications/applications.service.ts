// src/applications/applications.service.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { DatabaseService } from '../database/database.service';
import { OpenAiService } from '../openai/openai.service';
import { CreateApplicationDto } from './dto/create-application.dto';

@Injectable()
export class ApplicationsService {
  constructor(
    private prisma: DatabaseService,
    private openAiService: OpenAiService,
  ) {}

  async create(createApplicationDto: CreateApplicationDto, userId: number) {
    const { jobDescription, resumeId, companyName, jobTitle } = createApplicationDto;
    
    // 1. Get user's resume (default or specified)
    let resume;
    if (resumeId) {
      resume = await this.prisma.resume.findFirst({
        where: { 
          id: resumeId, 
          userId,
          isDeleted: false,
        },
      });
      if (!resume) {
        throw new NotFoundException('Resume not found');
      }
    } else {
      // Get default resume
      resume = await this.prisma.resume.findFirst({
        where: { 
          userId, 
          isDefault: true,
          isDeleted: false 
        },
      });
      if (!resume) {
        throw new NotFoundException('No default resume found. Please upload a resume first.');
      }
    }

    // 2. Prepare resume data for OpenAI
    const resumeData = {
      name: resume.name,
      email: resume.email,
      skill: resume.skill,
      experience: resume.experience,
      education: resume.education,
      certification: resume.certification,
    };

    // 3. Generate cover letter and matching analysis using OpenAI
    const aiResult = await this.openAiService.generateCoverLetterAndAnalysis(
      resumeData,
      jobDescription,
      companyName,
      jobTitle,
    );

    if(!aiResult || !aiResult.coverLetter 
      || !aiResult.matchingSummary || !aiResult.matchScore
    ) {
      throw new NotFoundException('Failed to generate cover letter and analysis');
    }

    // return {
    //   userId,
    //   resumeId: resume.id,
    //   jobDescription,
    //   coverLetter: aiResult.coverLetter,
    //   matchingSummary: aiResult.matchingSummary,
    //   matchScore: aiResult.matchScore,
    //   companyName: companyName,
    //   jobTitle: jobTitle,
    // }

    // 4. Save application to database
    const application = await this.prisma.application.create({
      data: {
        userId,
        resumeId: resume.id,
        jobDescription,
        coverLetter: aiResult.coverLetter,
        matchingSummary: aiResult.matchingSummary,
        matchScore: aiResult.matchScore,
        companyName: companyName,
        jobTitle: jobTitle,
      },
      include: {
        Resume: {
          select: {
            id: true,
            title: true,
            name: true,
          },
        },
      }
    });

    return application;
  }

  async findAll(userId: number) {
    return this.prisma.application.findMany({
      where: { userId },
      include: {
        Resume: {
          select: {
            id: true,
            title: true,
            name: true,
          }
        }
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOne(id: number, userId: number) {
    const application = await this.prisma.application.findFirst({
      where: { id, userId },
      include: {
        Resume: {
          select: {
            id: true,
            title: true,
            name: true,
          }
        }
      }
    });

    if (!application) {
      throw new NotFoundException('Application not found');
    }

    return application;
  }

  async remove(id: number, userId: number) {
    const application = await this.prisma.application.findFirst({
      where: { id, userId },
    });

    if (!application) {
      throw new NotFoundException('Application not found');
    }

    return this.prisma.application.delete({
      where: { id },
    });
  }
}