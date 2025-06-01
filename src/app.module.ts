import { Module } from "@nestjs/common";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { UsersModule } from "./users/users.module";
import { DatabaseModule } from "./database/database.module";
import { ThrottlerModule, ThrottlerGuard } from "@nestjs/throttler";
import { APP_GUARD } from "@nestjs/core";
import { MyLoggerModule } from "./my-logger/my-logger.module";
import { AuthModule } from "./auth/auth.module";
import { ResumesModule } from "./resumes/resumes.module";
import { S3Module } from "./s3/s3.module";
import { OpenaiModule } from "./openai/openai.module";
import { ApplicationsModule } from './applications/applications.module';

@Module({
  imports: [
    AuthModule,
    UsersModule,
    DatabaseModule,
    ResumesModule,
    S3Module,
    OpenaiModule,
    MyLoggerModule,
    ResumesModule,
    S3Module,
    OpenaiModule,
    ApplicationsModule,
    ThrottlerModule.forRoot({
      throttlers: [
        { name: "short", ttl: 1000, limit: 3 },
        { name: "long", ttl: 60000, limit: 100 },
      ],
    }),
    
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
  ],
})
export class AppModule {}
