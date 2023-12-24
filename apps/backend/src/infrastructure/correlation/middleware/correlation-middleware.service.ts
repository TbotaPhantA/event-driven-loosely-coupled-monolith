import { Injectable, NestMiddleware } from '@nestjs/common';
import { CorrelationService } from '../correlation.service';
import { CORRELATION_ID_HEADER } from '../correlationConstants';
import { Request, Response } from 'express';

@Injectable()
export class CorrelationMiddleware implements NestMiddleware {
  constructor(private readonly correlationService: CorrelationService) {}

  public use(req: Request, res: Response, next: () => void): void {
    const correlationIdHeader = req.get(CORRELATION_ID_HEADER);

    req.headers[CORRELATION_ID_HEADER] = this.correlationService.startNewCorrelationId(correlationIdHeader);

    next();
  }
}
