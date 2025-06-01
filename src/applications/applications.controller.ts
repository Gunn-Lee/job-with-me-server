// src/applications/applications.controller.ts
import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  UseGuards,
  Request,
  ParseIntPipe,
} from '@nestjs/common';
import { ApplicationsService } from './applications.service';
import { CreateApplicationDto } from './dto/create-application.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiBody,
} from '@nestjs/swagger';

interface RequestWithUser extends Request {
  user: {
    id: number;
    email: string;
    role: string;
    isActive: boolean;
  };
}

@ApiTags('Applications')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('applications')
export class ApplicationsController {
  constructor(private readonly applicationsService: ApplicationsService) {}

  @ApiOperation({ summary: 'Create a new job application with cover letter' })
  @ApiBody({ type: CreateApplicationDto })
  @ApiResponse({ 
    status: 201, 
    description: 'Application created successfully with cover letter and matching analysis' 
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 404, description: 'Resume not found' })
  @Post()
  create(
    @Body() createApplicationDto: CreateApplicationDto,
    @Request() req: RequestWithUser,
  ) {
    return this.applicationsService.create(createApplicationDto, req.user.id);
  }

  @ApiOperation({ summary: 'Get all applications for the current user' })
  @ApiResponse({ 
    status: 200, 
    description: 'List of applications retrieved successfully' 
  })
  @Get()
  findAll(@Request() req: RequestWithUser) {
    return this.applicationsService.findAll(req.user.id);
  }

  @ApiOperation({ summary: 'Get a specific application by ID' })
  @ApiResponse({ status: 200, description: 'Application retrieved successfully' })
  @ApiResponse({ status: 404, description: 'Application not found' })
  @Get(':id')
  findOne(
    @Param('id', ParseIntPipe) id: number,
    @Request() req: RequestWithUser,
  ) {
    return this.applicationsService.findOne(id, req.user.id);
  }

  @ApiOperation({ summary: 'Delete an application' })
  @ApiResponse({ status: 200, description: 'Application deleted successfully' })
  @ApiResponse({ status: 404, description: 'Application not found' })
  @Delete(':id')
  remove(
    @Param('id', ParseIntPipe) id: number,
    @Request() req: RequestWithUser,
  ) {
    return this.applicationsService.remove(id, req.user.id);
  }
}