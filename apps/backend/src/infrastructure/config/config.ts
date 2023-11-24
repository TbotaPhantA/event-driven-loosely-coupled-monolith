import 'dotenv/config';
import * as process from 'process';

const isRequired = (propName: keyof NodeJS.ProcessEnv): never => {
  throw new Error(`Config property ${propName} is required`);
};

class Config {
  app = {
    port: process.env.APP_PORT ?? isRequired('APP_PORT'),
  };

  eventStoreDB = {
    host: process.env.DB_HOST ?? isRequired('DB_HOST'),
    port: Number(process.env.DB_PORT ?? isRequired('DB_PORT')),
    username: process.env.DB_USERNAME ?? isRequired('DB_USERNAME'),
    password: process.env.DB_PASSWORD ?? isRequired('DB_PASSWORD'),
    database: process.env.DB_DATABASE ?? isRequired('DB_DATABASE'),
    synchronize: Boolean(
      process.env.DB_SYNCHRONIZE ?? isRequired('DB_SYNCHRONIZE'),
    ),
  };
}

export const config = new Config();
