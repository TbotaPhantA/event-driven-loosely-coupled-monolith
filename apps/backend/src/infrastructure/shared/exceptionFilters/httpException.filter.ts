import { ArgumentsHost, Catch, ExceptionFilter, HttpException } from '@nestjs/common';
import { Request, Response } from 'express';
import { ProductAlreadyCreatedException } from '../../../sales/application/exceptions/productAlreadyCreatedException';

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost): void {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();
    const status = exception.getStatus();

    if (exception instanceof ProductAlreadyCreatedException) {
      response
        .status(status)
        .json({
          message: exception.message,
          statusCode: status,
          timestamp: new Date().toISOString(),
          path: request.url,
          product: exception.product,
          links: exception.links,
        });
    } else {
      response
        .status(status)
        .json({
          message: exception.message,
          statusCode: status,
          timestamp: new Date().toISOString(),
          path: request.url,
        });
    }
  }
}
