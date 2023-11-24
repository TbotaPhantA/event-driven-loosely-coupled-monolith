import { Injectable } from '@nestjs/common';
import { config } from './config';

@Injectable()
export class ConfigService {
  getConfig(): typeof config {
    return config;
  }
}
