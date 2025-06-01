import { IsNotEmpty, IsString, IsOptional, IsNumber } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateApplicationDto {
  @ApiProperty({ 
    description: 'The job description text',
    example: 'We are looking for a Senior Software Engineer with 5+ years of experience in Node.js, React, and AWS...'
  })
  @IsNotEmpty()
  @IsString()
  jobDescription: string;

  @ApiProperty({ 
    description: 'Resume ID to use for the application (optional - will use default if not provided)',
    required: true 
  })
  @IsNotEmpty()
  @IsNumber()
  resumeId: number;

  @ApiProperty({ 
    description: 'Company name',
    required: true 
  })
  @IsNotEmpty()
  @IsString()
  companyName: string;

  @ApiProperty({ 
    description: 'Job title',
    required: true 
  })
  @IsNotEmpty()
  @IsString()
  jobTitle: string;
}