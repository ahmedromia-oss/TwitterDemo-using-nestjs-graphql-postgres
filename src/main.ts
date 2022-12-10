import { NestFactory } from '@nestjs/core';
import { useContainer } from 'typeorm';

import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  await app.listen(3000);
  // useContainer(app.select(AppModule), { fallbackOnErrors: true });

  
}
bootstrap();
