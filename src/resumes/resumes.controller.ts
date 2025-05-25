// src/resumes/resumes.controller.ts
import {
  Controller,
  Post,
  Get,
  Param,
  Delete,
  UseInterceptors,
  UploadedFile,
  ParseIntPipe,
  UseGuards,
  Request,
} from "@nestjs/common";
import { FileInterceptor } from "@nestjs/platform-express";
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard";
import { ResumesService } from "./resumes.service";
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiConsumes,
  ApiBody,
} from "@nestjs/swagger";

interface RequestWithUser extends Request {
  user: {
    id: number;
    email: string;
    role: string;
    isActive: boolean;
  };
}

@ApiTags("Resumes")
@Controller("resumes")
export class ResumesController {
  constructor(private readonly resumesService: ResumesService) {}

  @ApiBearerAuth()
  @ApiOperation({ summary: "Upload a resume" })
  @ApiConsumes("multipart/form-data")
  @ApiBody({
    schema: {
      type: "object",
      properties: {
        file: {
          type: "string",
          format: "binary",
          description: "The resume file to upload",
        },
      },
    },
  })
  @ApiResponse({ status: 201, description: "Resume successfully uploaded" })
  @ApiResponse({ status: 401, description: "Unauthorized" })
  @UseGuards(JwtAuthGuard)
  @Post("upload")
  @UseInterceptors(
    FileInterceptor("file", {
      limits: { fileSize: 4 * 1024 * 1024 }, // 4 MB limit
    })
  )
  async uploadResume(
    @UploadedFile() file: Express.Multer.File,
    @Request() req: RequestWithUser
  ) {
    console.log("user", req.user);
    return this.resumesService.create(file, req.user.id);
  }

  @ApiBearerAuth()
  @ApiOperation({ summary: "Get all resumes for the current user" })
  @ApiResponse({
    status: 200,
    description: "List of resumes retrieved successfully",
  })
  @ApiResponse({ status: 401, description: "Unauthorized" })
  @UseGuards(JwtAuthGuard)
  @Get(":userId")
  findAll(@Param("userId", ParseIntPipe) userId: number) {
    return this.resumesService.findAll(userId);
  }

  @ApiBearerAuth()
  @ApiOperation({ summary: "Get a specific resume by ID" })
  @ApiResponse({ status: 200, description: "Resume retrieved successfully" })
  @ApiResponse({ status: 401, description: "Unauthorized" })
  @ApiResponse({ status: 404, description: "Resume not found" })
  @UseGuards(JwtAuthGuard)
  @Get(":id")
  findOne(@Param("id", ParseIntPipe) id: number) {
    return this.resumesService.findOne(id);
  }

  @ApiBearerAuth()
  @ApiOperation({ summary: "Delete a resume" })
  @ApiResponse({ status: 200, description: "Resume successfully deleted" })
  @ApiResponse({ status: 401, description: "Unauthorized" })
  @ApiResponse({ status: 404, description: "Resume not found" })
  @UseGuards(JwtAuthGuard)
  @Delete(":id")
  remove(@Param("id", ParseIntPipe) id: number) {
    return this.resumesService.remove(id);
  }
}
