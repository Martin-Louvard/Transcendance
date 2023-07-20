import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';

async function bootstrap() {

  const app = await NestFactory.create(AppModule);
  app.enableCors({origin: "http://localhost:3000"});

  const config = new DocumentBuilder()

    .setTitle('Transcendence')

    .setDescription('The Transcendence API description')

    .setVersion('0.1')

    .build();


  const document = SwaggerModule.createDocument(app, config);

  SwaggerModule.setup('api', app, document);


  await app.listen(3000);

}

bootstrap();