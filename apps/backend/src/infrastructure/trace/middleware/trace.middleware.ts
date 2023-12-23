import { Injectable, NestMiddleware } from '@nestjs/common';
import * as http from 'http';
import { CorrelationService } from '../correlation.service';
import { CORRELATION_ID_HEADER } from '../correlationConstants';

@Injectable()
export class TraceMiddleware implements NestMiddleware {
  constructor(private readonly traceService: CorrelationService) {}

  public use(req: http.IncomingMessage, res: http.ServerResponse, next: () => void): void {
    const traceIdHeader = req.headers[CORRELATION_ID_HEADER];

    req.headers[CORRELATION_ID_HEADER] = this.traceService.startNewTraceId(traceIdHeader);

    next();
  }
}
