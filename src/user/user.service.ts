import { HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entity/user.entity';
import { IStatusResponse } from '../types/response';
import { FAILURE_RESPONSE, SUCCESS_RESPONSE } from '../constants/response';
import { UpdateUserDto } from './dto/update-user.dto';
import { throwHttpException } from '../util/error';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
  ) {}

  async findUserById(id: string): Promise<User> {
    return await this.userRepository.findOne({ id });
  }

  async findUserByEmail(
    email: string,
    confirmed: boolean = null,
  ): Promise<User> {
    return await this.userRepository.findOne({
      email,
      ...(confirmed !== null ? { confirmed } : {}),
    });
  }

  async findUserByNickname(
    nickname: string,
    confirmed: boolean = null,
  ): Promise<User> {
    return await this.userRepository.findOne({
      nickname,
      ...(confirmed !== null ? { confirmed } : {}),
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
