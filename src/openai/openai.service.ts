// src/openai/openai.service.ts
import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import OpenAI from "openai";

@Injectable()
export class OpenAiService {
  private openai: OpenAI;

  constructor(private configService: ConfigService) {
    this.openai = new OpenAI({
      apiKey: this.configService.get("OPENAI_API_KEY"),
    });
  }

  async summarizeResume(resumeText: string): Promise<string> {
    const response = await this.openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content:
            "You are a helpful assistant that summarizes a resume for job applications.",
        },
        {
          role: "user",
          content: `Summarize this resume for job application including the following details: name, contact information, education, work experience, skills, and certifications.:\n\n${resumeText}`,
        },
        {
          role: "user",
          content: `the result should be in a valid object string to be parsed directly with the following keys: name, contact, education, workExperience, skills, certifications. \n\n
            Example: { "name": "John Doe", "contact": "johndoe@gmail.com", "education": "Stony Brook University", "workExperience": [
                {
                  "company": "Universal Steel Product",
                  "location": "Fort Lee, NJ",
                  "position": "Software Engineer",
                  "from": "Mar 2024",
                  "to": "Present",
                  "description": "Led the design and development of new ERP modules using TypeScript, Next.js, Node.js, and GCP, boosting performance (25% lower latency, 55% higher data capacity) and migrating to a scalable cloud architecture, reducing server maintenance costs by $560/month. Implemented CI/CD, unit/E2E testing (75% coverage), and agile practices to cut deployment times by 30% and shorten project timelines by 2 weeks."
                },
            ], "skills": ["JavaScript", "React", "Next.js", "Node.js", "AWS", "Unit Testing"], "certifications": ["AWS Solutions Architect Certificate", "Salesforce Developer Certificate"] } \n Work experience should be an array of objects with the following keys: company, location, position, from, to, description with the 3 most recent experience at most. \n\n
            `,
        },
      ],
      max_tokens: 500,
    });

    return response.choices[0].message.content as string;
  }
}
