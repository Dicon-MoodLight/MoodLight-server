import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { QuestionModule } from './question/question.module';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { MorganInterceptor, MorganModule } from 'nest-morgan';
import { DatabaseConfigModule } from './database-config.module';
import { ConfigModule } from '@nestjs/config';
import { AnswerModule } from './answer/answer.module';
import { ScheduleModule } from '@nestjs/schedule';
import { CommentModule } from './comment/comment.module';
import { ENV_PATH } from './constants/env';

@Module({
  imports: [
    AuthModule,
    QuestionModule,
    UserModule,
    MorganModule,
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: [ENV_PATH],
    }),
    DatabaseConfigModule,
    AnswerModule,
    ScheduleModule.forRoot(),
    CommentModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_INTERCEPTOR,
      useClass: MorganInterceptor(
        process.env.NODE_ENV === 'production' ? 'combined' : 'dev',
      ),
    },
  ],
})
export class AppModule {}
