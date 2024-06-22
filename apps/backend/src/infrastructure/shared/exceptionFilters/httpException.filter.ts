import { ArgumentsHost, Catch, ExceptionFilter, HttpException } from '@nestjs/common';
import {
  ProductAlreadyCreatedException,
} from '../../../sales/application/product/exceptions/productAlreadyCreatedException';
import { FastifyRequest, FastifyReply } from 'fastify';

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost): void {
    const ctx = host.switchToHttp();
    const request = ctx.getRequest<FastifyRequest>();
    const reply = ctx.getResponse<FastifyReply>();
    const status = exception.getStatus();

    if (exception instanceof ProductAlreadyCreatedException) {
      reply
        .status(status)
        .send({
          message: exception.message,
          statusCode: status,
          timestamp: new Date().toISOString(),
          path: request.url,
          product: exception.product,
          links: exception.links,
        });
    } else {
      reply
        .status(status)
        .send({
          message: exception.message,
          statusCode: status,
          timestamp: new Date().toISOString(),
          path: request.url,
        });
    }
  }
}
