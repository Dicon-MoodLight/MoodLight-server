import { HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entity/user.entity';
import { StatusResponse } from '../types/response';
import { SUCCESS_RESPONSE } from '../constants/response';
import { UpdateUserDto } from './dto/update-user.dto';
import { Verification } from '../auth/entity/verfication.entity';
import { exceptionHandler } from '../util/error';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
    @InjectRepository(Verification)
    private verificationRepository: Repository<Verification>,
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
  }: UpdateUserDto): Promise<StatusResponse> {
    try {
      await this.userRepository.update(id, updateUserDto);
    } catch (err) {
      exceptionHandler(err);
    }
    return SUCCESS_RESPONSE;
  }

  async deleteUser(id): Promise<StatusResponse> {
    try {
      await this.userRepository.delete({ id });
    } catch (err) {
      exceptionHandler(err);
    }
    return SUCCESS_RESPONSE;
  }
}
