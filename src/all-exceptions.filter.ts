import {
  Catch,
  ArgumentsHost,
  HttpStatus,
  HttpException,
} from "@nestjs/common";
import { BaseExceptionFilter } from "@nestjs/core";
import { Request, Response } from "express";
import { MyLoggerService } from "./my-logger/my-logger.service";
import { PrismaClientValidationError } from "@prisma/client/runtime/library";

type MyResponseObj = {
  statusCode: number;
  timestamp: string;
  path: string;
  response: string | object;
};

@Catch()
export class AllExceptionsFilter extends BaseExceptionFilter {
  private readonly logger = new MyLoggerService(AllExceptionsFilter.name);

  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp(); //context
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    //pre-formatting the response object
    const myResponseObj: MyResponseObj = {
      statusCode: 500,
      timestamp: new Date().toISOString(),
      path: request.url,
      response: "",
    };

    // Handle Various Error Types
    // Add more Prisma Error Types if you want

    // Check if this is a socket.io 404 request
    const isSocketIoRequest = request.url.startsWith("/socket.io/");
    if (exception instanceof HttpException) {
      myResponseObj.statusCode = exception.getStatus();
      myResponseObj.response = exception.getResponse();

      // Don't log socket.io 404s as errors
      if (isSocketIoRequest && myResponseObj.statusCode === 404) {
        response.status(myResponseObj.statusCode).json(myResponseObj);
        return; // Skip logging and parent call
      }
    } else if (exception instanceof PrismaClientValidationError) {
      myResponseObj.statusCode = 422;
      myResponseObj.response = exception.message.replaceAll(/\n/g, " ");
    } else {
      myResponseObj.statusCode = HttpStatus.INTERNAL_SERVER_ERROR;
      myResponseObj.response = "Internal Server Error";
    }

    //Send response
    response.status(myResponseObj.statusCode).json(myResponseObj);

    //Log the error
    this.logger.error(myResponseObj.response, AllExceptionsFilter.name);

    //Call the parent class's catch method
    super.catch(exception, host);
  }
}
