import { Injectable } from '@nestjs/common';

@Injectable()
export class TimeService {
  now(): Date {
    return new Date();
  }
}
