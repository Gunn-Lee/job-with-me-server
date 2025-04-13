// src/openai/openai.service.ts
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import OpenAI from 'openai';

@Injectable()
export class OpenAiService {
  private openai: OpenAI;
  
  constructor(private configService: ConfigService) {
    this.openai = new OpenAI({
      apiKey: this.configService.get('OPENAI_API_KEY'),
    });
  }

  async summarizeResume(resumeText: string): Promise<string> {
    const response = await this.openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        {
          role: "system",
          content: "You are a helpful assistant that summarizes resumes for job applications."
        },
        {
          role: "user",
          content: `Summarize this resume for job application including the following details: name, contact information, education, work experience, skills, and certifications.:\n\n${resumeText}`
        }
      ],
      max_tokens: 500,
    });

    return response.choices[0].message.content as string;
  }
}