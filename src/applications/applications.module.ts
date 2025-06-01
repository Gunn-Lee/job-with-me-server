// src/applications/applications.module.ts
import { Module } from '@nestjs/common';
import { ApplicationsService } from './applications.service';
import { ApplicationsController } from './applications.controller';
import { DatabaseModule } from '../database/database.module';  
import { OpenaiModule } from '../openai/openai.module';        

@Module({
  imports: [
    DatabaseModule,  
    OpenaiModule,    
  ],
  controllers: [ApplicationsController],
  providers: [ApplicationsService],
  exports: [ApplicationsService],
})
export class ApplicationsModule {}
