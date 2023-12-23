import { Injectable, NestMiddleware } from '@nestjs/common';
import * as http from 'http';
import { TraceService } from '../trace.service';
import { CORRELATION_ID_HEADER } from '../../shared/constants';

@Injectable()
export class TraceMiddleware implements NestMiddleware {
  constructor(private readonly traceService: TraceService) {}

  public use(req: http.IncomingMessage, res: http.ServerResponse, next: () => void): void {
    const traceIdHeader = req.headers[CORRELATION_ID_HEADER];

    req.headers[CORRELATION_ID_HEADER] = this.traceService.startNewTraceId(traceIdHeader);

    next();
  }
}
