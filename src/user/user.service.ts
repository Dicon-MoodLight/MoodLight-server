import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entity/user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { IStatusResponse } from '../types/response';
import { FAILURE_RESPONSE, SUCCESS_RESPONSE } from '../util/response';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
  ) {}

  async findUserById(id: string): Promise<User> {
    return await this.userRepository.findOne({ id });
  }

  async findUserByEmail(email: string): Promise<User> {
    return await this.userRepository.findOne({ email });
  }

  async findUserByNickname(nickname: string): Promise<User> {
    return await this.userRepository.findOne({ nickname });
  }

  async createUser(createUserDto: CreateUserDto): Promise<IStatusResponse> {
    try {
      const newUser = await this.userRepository.create(createUserDto);
      await this.userRepository.save(newUser);
    } catch (err) {
      return { ...FAILURE_RESPONSE, message: err };
    }
    return SUCCESS_RESPONSE;
  }

  async updateUser({
    id,
    ...updateUserDto
  }: UpdateUserDto): Promise<IStatusResponse> {
    try {
      const user = await this.findUserById(id);
      await this.userRepository.save({ ...user, ...updateUserDto });
    } catch (err) {
      return { ...FAILURE_RESPONSE, message: err };
    }
  }

  async deleteUser(id): Promise<IStatusResponse> {
    try {
      await this.userRepository.delete({ id });
    } catch (err) {
      return { ...FAILURE_RESPONSE, message: err };
    }
  }
}
