import { ulid } from 'ulid';

export class RandomService {
  generateULID(): string {
    return ulid();
  }
}
