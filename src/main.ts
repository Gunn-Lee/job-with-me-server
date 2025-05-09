import { NestFactory, HttpAdapterHost } from "@nestjs/core";
import { AppModule } from "./app.module";
import { MyLoggerService } from "./my-logger/my-logger.service";
import { AllExceptionsFilter } from "./all-exceptions.filter";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { bufferLogs: true });

  const { httpAdapter } = app.get(HttpAdapterHost);
  app.useGlobalFilters(new AllExceptionsFilter(httpAdapter));

  app.useLogger(app.get(MyLoggerService));
  app.enableCors({
    origin: ["http://localhost:3000"], // Your frontend origin
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS",
    credentials: true, // Important for requests with credentials
    allowedHeaders: "Content-Type, Accept, Authorization",
  });
  app.setGlobalPrefix("api");

  // Swagger setup
  const config = new DocumentBuilder()
    .setTitle("Job With Me API")
    .setDescription("The Job With Me API documentation")
    .setVersion("1.0")
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup("docs", app, document);

  await app.listen(8080);
}
bootstrap();
