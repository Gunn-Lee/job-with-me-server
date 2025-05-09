import { Module } from "@nestjs/common";
import { ResumesController } from "./resumes.controller";
import { ResumesService } from "./resumes.service";
import { S3Module } from "src/s3/s3.module";
import { OpenaiModule } from "src/openai/openai.module";
import { DatabaseModule } from "src/database/database.module";

@Module({
  imports: [S3Module, OpenaiModule, DatabaseModule],
  controllers: [ResumesController],
  providers: [ResumesService],
})
export class ResumesModule {}
