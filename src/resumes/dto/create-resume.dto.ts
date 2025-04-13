// src/resumes/dto/create-resume.dto.ts
import { IsNotEmpty, IsNumber } from 'class-validator';

export class CreateResumeDto {
  @IsNotEmpty()
  filePath: string;

  @IsNumber()
  userId: number;
}