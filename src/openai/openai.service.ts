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
    temperature: 0.2 // Optional: add for more consistent output
  });

  // If you want to extract only the JSON string from the response, you could parse it here.
  return response.choices[0].message.content as string;
  }
}
