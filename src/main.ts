import { NestFactory, HttpAdapterHost } from "@nestjs/core";
import { AppModule } from "./app.module";
import { MyLoggerService } from "./my-logger/my-logger.service";
import { AllExceptionsFilter } from "./all-exceptions.filter";

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { bufferLogs: true });

  const { httpAdapter } = app.get(HttpAdapterHost);
  app.useGlobalFilters(new AllExceptionsFilter(httpAdapter));

  app.useLogger(app.get(MyLoggerService));
  app.enableCors({
    origin: "http://localhost:3000", // Your frontend origin
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS",
    credentials: true, // Important for requests with credentials
    allowedHeaders: "Content-Type, Accept, Authorization",
  });
  app.setGlobalPrefix("api");
  await app.listen(8080);
}
bootstrap();
