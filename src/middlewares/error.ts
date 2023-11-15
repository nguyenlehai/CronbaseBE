import { first, get } from 'lodash';
import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  BadRequestException,
  InternalServerErrorException,
} from '@nestjs/common';
import { Response, Request } from 'express';
@Catch(BadRequestException)
export class BadRequestExceptionFilter implements ExceptionFilter {
  catch(exception: BadRequestException, host: ArgumentsHost) {
    const errorResponse = exception?.getResponse();
    const error =
      (Array.isArray(get(errorResponse, 'message'))
        ? first(get(errorResponse, 'message'))
        : get(errorResponse, 'message')) || exception.message;
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const status = exception.getStatus();
    response.status(status).json({
      errors: [error],
      success: false,
    });
  }
}

@Catch(InternalServerErrorException)
export class InternalExceptionFilter implements ExceptionFilter {
  catch(exception: Error, host: ArgumentsHost) {
    const error = exception.message;
    const ctx = host.switchToHttp();
    const request = ctx.getRequest<Request>();
    const response = ctx.getResponse<Response>();
    response.status(500).json({
      errors: [error],
      success: false,
    });
  }
}
