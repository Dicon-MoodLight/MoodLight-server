import { User } from '../user/entity/user.entity';
import { Answer } from '../answer/entity/answer.entity';
import { Question } from '../question/entity/question.entity';
import { Comment } from '../comment/entity/comment.entity';
import { Verification } from '../auth/entity/verification.entity';
import { AnswerLike } from '../answer/entity/answer-like.entity';

export const entities = [
  User,
  Answer,
  Question,
  Comment,
  Verification,
  AnswerLike,
];
