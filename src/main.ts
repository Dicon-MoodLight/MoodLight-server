import { NestFactory } from '@nestjs/core';
import { SwaggerModule } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';
import { firebaseConfig } from './utils/firebase-config';
import { SWAGGER_DOCUMENT, SWAGGER_OPTION } from './constants/swagger';
import {
  readDocumentInJSON,
  SwaggerType,
  writeDocumentInJSON,
} from './utils/swagger';

const PORT = process.env.PORT || 5000;
const SWAGGER_MODE: SwaggerType = 'create';

(async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    cors: { origin: true, credentials: true },
  });
  let document = SWAGGER_DOCUMENT;
  if (SWAGGER_MODE === 'create') {
    document = SwaggerModule.createDocument(app, SWAGGER_OPTION);
    await writeDocumentInJSON(document);
  } else if (SWAGGER_MODE === 'json') {
    document = await readDocumentInJSON();
  }
  SwaggerModule.setup('docs', app, document);
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );
  await app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}.`);
    firebaseConfig();
  });
})();
