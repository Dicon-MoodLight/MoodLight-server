import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { User } from './entity/user.entity';
import { Verification } from '../auth/entity/verfication.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User, Verification])],
  providers: [UserService],
  controllers: [UserController],
})
export class UserModule {}
