"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@nestjs/core");
const app_module_1 = require("./app.module");
const my_logger_service_1 = require("./my-logger/my-logger.service");
const all_exceptions_filter_1 = require("./all-exceptions.filter");
async function bootstrap() {
    const app = await core_1.NestFactory.create(app_module_1.AppModule, { bufferLogs: true });
    const { httpAdapter } = app.get(core_1.HttpAdapterHost);
    app.useGlobalFilters(new all_exceptions_filter_1.AllExceptionsFilter(httpAdapter));
    app.useLogger(app.get(my_logger_service_1.MyLoggerService));
    app.enableCors({
        origin: "http://localhost:3000",
        methods: "GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS",
        credentials: true,
        allowedHeaders: "Content-Type, Accept, Authorization",
    });
    app.setGlobalPrefix("api");
    await app.listen(8080);
}
bootstrap();
//# sourceMappingURL=main.js.map