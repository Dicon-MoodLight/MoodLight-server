import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigService } from '@nestjs/config';
import { User } from './user/entity/user.entity';
import { Answer } from './answer/entity/answer.entity';
import { Question } from './question/entity/question.entity';
import { Comment } from './comment/entity/comment.entity';
import { Verification } from './auth/entity/verification.entity';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      useFactory: async (config: ConfigService) => ({
        port: parseInt(config.get('DB_PORT')),
        database: config.get<string>('DB_NAME'),
        username: config.get<string>('DB_USERNAME'),
        password: config.get<string>('DB_PASSWORD'),
        host: config.get<string>('DB_HOST'),
        autoLoadEntities: true,
        entities: [User, Answer, Question, Comment, Verification],
        synchronize: true,
        type: 'mysql',
        charset: 'utf8_general_ci',
      }),
      inject: [ConfigService],
    }),
  ],
  controllers: [],
  providers: [],
})
export class DatabaseConfigModule {}
