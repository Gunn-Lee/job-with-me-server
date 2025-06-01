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
    model: "gpt-4o", // Use "gpt-4o" unless you have access to "gpt-4o-mini"
    messages: [
      {
        role: "system",
        content: "You are a helpful assistant that summarizes a resume for job applications."
      },
      {
        role: "user",
        content: `
Summarize the following resume and extract these fields:
- name
- email (from resume text, if available)
- linkedin (if available, otherwise leave empty)
- education (array: degree, major, institution, from, to)
- experience (array: company, location, position, from, to (use "Present" if current), description of 2-3 sentences: responsibilities, key tech/frameworks, quantifiable achievements)
- skill (all mentioned and directly relevant skills, comma-separated)
- certification (comma-separated)
- note (additional note if any)
- summary (a brief summary of the resume in 500 characters or less)

Return ONLY a valid object string with this exact structure, no explanations, no markdown, nothing else:

{
  "name": "",
  "email": "",
  "linkedIn": "",
  "education": [
    {
      "degree": "",
      "major": "",
      "institution": "",
      "from": "",
      "to": ""
    }
  ],
  "experience": [
    {
      "company": "",
      "location": "",
      "position": "",
      "from": "",
      "to": "",
      "description": ""
    }
  ],
  "skill": "",
  "certification": "",
  "note": ""
  "summary": ""
}

Resume:
${resumeText}
        `.trim()
      }
    ],
    max_tokens: 1000,
    temperature: 0.2 // Optional
  });

  // If you want to extract only the JSON string from the response, you could parse it here.
  return response.choices[0].message.content as string;
  }

  async generateCoverLetterAndAnalysis(resume: any, jobDescription: string, companyName: string, jobTitle: string): Promise<{
    coverLetter: string;
    matchingSummary: string;
    matchScore: number;
    companyName: string;
    jobTitle: string;
  }> {
    const prompt = `
Based on the following resume and job description, please:
1. Generate a professional cover letter
2. Provide a matching analysis showing how well the candidate fits the role
3. Give a match score from 0-100

Resume Information:
Name: ${resume.name || 'N/A'}
Email: ${resume.email || 'N/A'}
Skills: ${Array.isArray(resume.skill) ? resume.skill.join(', ') : resume.skill || 'N/A'}
Experience: ${JSON.stringify(resume.experience || [])}
Education: ${JSON.stringify(resume.education || [])}
Certifications: ${Array.isArray(resume.certification) ? resume.certification.join(', ') : resume.certification || 'N/A'}

Job Description:
${jobDescription}
Company Name: ${companyName}
Job Title: ${jobTitle}

Please return a object string with the following structure:
{
  "coverLetter": "Professional cover letter text...",
  "matchingSummary": "Analysis of how well the candidate matches the role, what strengths they have, and what skills they might need to develop...",
  "matchScore": 85, // Match score from 0-100
  "companyName": "${companyName}" or provided company name in the job description,
  "jobTitle": "${jobTitle}" or provided job title in the job description
}
`;

    const response = await this.openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content: "You are an expert career counselor and recruiter. Generate professional, concise and personalized cover letters within 1000 characters and provide detailed job matching analysis within 500 characters."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      max_tokens: 2000,
      temperature: 0.7,
    });

    try {
      const result = response.choices[0].message.content ? JSON.parse(response.choices[0].message.content) : null;
      if (!result || typeof result !== 'object' || !result.coverLetter || !result.matchingSummary || typeof result.matchScore !== 'number') {
        throw new Error('Invalid response format from OpenAI');
      }
      return {
        coverLetter: result.coverLetter,
        matchingSummary: result.matchingSummary,
        matchScore: result.matchScore,
        companyName: result.companyName || companyName,
        jobTitle: result.jobTitle || jobTitle,
      };
    } catch (error) {
      throw new Error('Failed to parse OpenAI response');
    }
  }
}
