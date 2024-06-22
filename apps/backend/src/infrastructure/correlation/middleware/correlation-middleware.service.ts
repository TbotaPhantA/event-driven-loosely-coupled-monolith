import { Injectable, NestMiddleware } from '@nestjs/common';
import { CorrelationService } from '../correlation.service';
import { CORRELATION_ID_HEADER } from '../correlationConstants';
import { FastifyRequest, FastifyReply } from 'fastify';

@Injectable()
export class CorrelationMiddleware implements NestMiddleware {
  constructor(private readonly correlationService: CorrelationService) {}

  public use(req: FastifyRequest['raw'], res: FastifyReply['raw'], next: () => void): void {
    const correlationIdHeader = req.headers[CORRELATION_ID_HEADER];

    req.headers[CORRELATION_ID_HEADER] = this.correlationService.startNewCorrelationId(correlationIdHeader);

    next();
  }
}
