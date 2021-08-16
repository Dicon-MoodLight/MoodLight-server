import { Body, Controller, Get, Param, Put, Query } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { User } from './entity/user.entity';
import { UserService } from './user.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { IExistResponse, IStatusResponse } from '../types/response';
import { GetUserIsExistDto } from './dto/get-user-is-exist.dto';

@ApiTags('User')
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @ApiOperation({ summary: '사용자 이메일 or 닉네임 가입 여부 확인' })
  @Get('exist')
  async getUserIsExist(
    @Query() { email, nickname }: GetUserIsExistDto,
  ): Promise<IExistResponse> {
    return {
      exist: !!(email
        ? await this.userService.findUserByEmail(email)
        : await this.userService.findUserByNickname(nickname)),
    };
  }

  @ApiOperation({ summary: '사용자 정보 가져오기' })
  @Get(':id')
  async findUserById(@Param() id: string): Promise<User> {
    return await this.userService.findUserById(id);
  }

  @ApiOperation({ summary: '사용자 정보 업데이트' })
  @Put()
  async updateUser(
    @Body() updateUserDto: UpdateUserDto,
  ): Promise<IStatusResponse> {
    return await this.userService.updateUser(updateUserDto);
  }
}
