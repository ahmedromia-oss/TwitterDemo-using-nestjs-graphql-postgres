import { NestFactory } from '@nestjs/core';

import graphqlUploadExpress = require('graphql-upload/graphqlUploadExpress.js');


import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.use(graphqlUploadExpress({ maxFileSize: 1000000, maxFiles: 10    }));
  await app.listen(3000);

  
}
bootstrap();
