import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { config } from './infrastructure/config/config';

async function bootstrap(): Promise<void> {
  const app = await NestFactory.create(AppModule);

  const documentConfig = new DocumentBuilder().setTitle('Nestjs DDD example').setVersion('1.0.0').build();

  const document = SwaggerModule.createDocument(app, documentConfig);
  SwaggerModule.setup('api', app, document);

  await app.listen(config.app.port, () => {
    console.log('Application started on: ', config.app.origin);
  });
}
bootstrap();
