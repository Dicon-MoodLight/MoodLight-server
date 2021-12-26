import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entity/user.entity';
import { StatusResponse } from '../types/response';
import { SUCCESS_RESPONSE } from '../constants/response';
import { UpdateUserDto } from './dto/update-user.dto';
import { Verification } from '../auth/entity/verification.entity';
import { exceptionHandler } from '../utils/error';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
    @InjectRepository(Verification)
    private verificationRepository: Repository<Verification>,
  ) {}

  async getUserNicknameIsExist(nickname: string): Promise<boolean> {
    const nicknameOfVerificationIsExist = this.verificationRepository.findOne({
      nickname,
    });
    const nicknameOfUserIsExist = this.findUserByNickname(nickname);
    return !!(
      (await nicknameOfVerificationIsExist) || (await nicknameOfUserIsExist)
    );
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
    userId,
    ...updateUserDto
  }: UpdateUserDto): Promise<StatusResponse> {
    try {
      await this.userRepository.update(userId, updateUserDto);
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
