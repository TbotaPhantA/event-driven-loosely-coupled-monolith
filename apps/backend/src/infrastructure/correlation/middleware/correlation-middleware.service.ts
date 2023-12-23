import { Injectable, NestMiddleware } from '@nestjs/common';
import * as http from 'http';
import { CorrelationService } from '../correlation.service';
import { CORRELATION_ID_HEADER } from '../correlationConstants';

@Injectable()
export class CorrelationMiddleware implements NestMiddleware {
  constructor(private readonly correlationService: CorrelationService) {}

  public use(req: http.IncomingMessage, res: http.ServerResponse, next: () => void): void {
    const correlationIdHeader = req.headers[CORRELATION_ID_HEADER];

    req.headers[CORRELATION_ID_HEADER] = this.correlationService.startNewCorrelationId(correlationIdHeader);

    next();
  }
}
