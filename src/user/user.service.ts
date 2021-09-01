import { HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entity/user.entity';
import { IStatusResponse } from '../types/response';
import { FAILURE_RESPONSE, SUCCESS_RESPONSE } from '../constants/response';
import { UpdateUserDto } from './dto/update-user.dto';
import { throwHttpException } from '../util/error';
import { Verification } from '../auth/entity/verfication.entity';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
    @InjectRepository(Verification) private verificationRepository: Repository<Verification>,
  ) {}

  async getUserNicknameIsExist(
    nickname: string,
    email: string = undefined,
  ): Promise<boolean> {
    const nicknameIsExist = await this.verificationRepository.findOne({
      nickname,
    });
    return !!(await this.findUserByNickname(nickname)) || email
      ? nicknameIsExist.email !== email
      : false;
  }

  async findUserById(id: string): Promise<User> {
    return await this.userRepository.findOne({ id });
  }

  async findUserByEmail(email: string): Promise<User> {
    return await this.userRepository.findOne({
      email,
    });
  }

  async findUserByNickname(nickname: string): Promise<User> {
    return await this.userRepository.findOne({
      nickname,
    });
  }

  async updateUser({
    id,
    ...updateUserDto
  }: UpdateUserDto): Promise<IStatusResponse> {
    try {
      await this.userRepository.update(id, updateUserDto);
    } catch (err) {
      throwHttpException(FAILURE_RESPONSE, HttpStatus.CONFLICT);
    }
    return SUCCESS_RESPONSE;
  }

  async deleteUser(id): Promise<IStatusResponse> {
    try {
      await this.userRepository.delete({ id });
    } catch (err) {
      throwHttpException(FAILURE_RESPONSE, HttpStatus.CONFLICT);
    }
    return SUCCESS_RESPONSE;
  }
}
