import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { config } from './infrastructure/config/config';
import { Transport } from '@nestjs/microservices';

async function bootstrap(): Promise<void> {
  const app = await NestFactory.create(AppModule);

  const documentConfig = new DocumentBuilder().setTitle('Nestjs DDD example').setVersion('1.0.0').build();

  const document = SwaggerModule.createDocument(app, documentConfig);
  SwaggerModule.setup('api', app, document);

  app.connectMicroservice({
    transport: Transport.KAFKA,
    options: {
      client: {
        brokers: [
          `${config.kafka.kafka1Host}:${config.kafka.kafka1ExternalPort}`,
          `${config.kafka.kafka2Host}:${config.kafka.kafka2ExternalPort}`,
          `${config.kafka.kafka3Host}:${config.kafka.kafka3ExternalPort}`,
        ],
        connectionTimeout: 10000,
      },
      consumer: {
        groupId: config.kafka.consumerGroup,
      },
    },
  }, { inheritAppConfig: true });

  await app.startAllMicroservices()
  await app.listen(config.app.port, () => {
    console.log('Application started on: ', config.app.origin);
  });
}
bootstrap();
