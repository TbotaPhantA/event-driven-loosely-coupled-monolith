import * as dotenv from 'dotenv';

export function loadEnvironment(): void {
  if (!!process.argv.find((arg) => arg === "--acceptance-tests")) {
    dotenv.config({ path: '.env.test.local' });
  } else {
    dotenv.config();
  }
}
