import 'dotenv/config';
import * as process from 'process';

const isRequired = (propName: keyof NodeJS.ProcessEnv): never => {
  throw new Error(`Config property ${propName} is required`);
};

export class Config {
  app = {
    port: process.env.APP_PORT ?? isRequired('APP_PORT'),
  };

  database = {
    host: process.env.DB_HOST ?? isRequired('DB_HOST'),
    port: Number(process.env.DB_PORT ?? isRequired('DB_PORT')),
    username: process.env.DB_USERNAME ?? isRequired('DB_USERNAME'),
    password: process.env.DB_PASSWORD ?? isRequired('DB_PASSWORD'),
    database: process.env.DB_DATABASE ?? isRequired('DB_DATABASE'),
    synchronize: Boolean(process.env.DB_SYNCHRONIZE ?? isRequired('DB_SYNCHRONIZE')),
  };

  kafka = {
    kafka1ExternalPort: process.env.KAFKA1_EXTERNAL_PORT ?? isRequired('KAFKA1_EXTERNAL_PORT'),
    kafka1Host: process.env.KAFKA1_HOST ?? isRequired('KAFKA1_HOST'),
    kafka2ExternalPort: process.env.KAFKA2_EXTERNAL_PORT ?? isRequired('KAFKA2_EXTERNAL_PORT'),
    kafka2Host: process.env.KAFKA2_HOST ?? isRequired('KAFKA2_HOST'),
    kafka3ExternalPort: process.env.KAFKA3_EXTERNAL_PORT ?? isRequired('KAFKA3_EXTERNAL_PORT'),
    kafka3Host: process.env.KAFKA3_HOST ?? isRequired('KAFKA3_HOST'),
    consumerGroup: process.env.KAFKA_CONSUMER_GROUP ?? isRequired('KAFKA_CONSUMER_GROUP'),
    kafkaProductsTopic: process.env.KAFKA_SALES_PRODUCTS_TOPIC ?? isRequired('KAFKA_SALES_PRODUCTS_TOPIC'),
  }

  debezium = {
    protocol: process.env.DEBEZIUM_PROTOCOL ?? isRequired('DEBEZIUM_PROTOCOL'),
    host: process.env.DEBEZIUM_HOST ?? isRequired('DEBEZIUM_HOST'),
    port: process.env.DEBEZIUM_PORT ?? isRequired('DEBEZIUM_PORT'),
  }
}

export const config = new Config();
