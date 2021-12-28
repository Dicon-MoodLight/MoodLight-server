import { NestFactory } from '@nestjs/core';
import { SwaggerModule } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';
import { firebaseConfig } from './utils/firebase-config';
import { SWAGGER_DOCUMENT } from './constants/swagger';

const PORT = process.env.PORT || 5000;

(async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    cors: { origin: true, credentials: true },
  });
  SwaggerModule.setup('docs', app, SWAGGER_DOCUMENT);
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
