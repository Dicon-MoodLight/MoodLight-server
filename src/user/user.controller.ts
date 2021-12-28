import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Put,
  Query,
  UseGuards,
  Req,
  ConflictException,
} from '@nestjs/common';
import { User } from './entity/user.entity';
import { UserService } from './user.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { ExistResponse, StatusResponse } from '../types/response';
import { JwtAuthGuard } from '../auth/guard/jwt-auth.guard';
import { UserIdDto } from './dto/user-id.dto';
import { GetUserIsExistDto } from './dto/get-user-is-exist.dto';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('exist')
  async getUserIsExist(
    @Query() { email, nickname }: GetUserIsExistDto,
  ): Promise<ExistResponse> {
    if (!email && !nickname) throw ConflictException;
    let exist: boolean;
    const [existEmail, existNickname] = await Promise.all([
      this.userService.findUserByEmail(email),
      this.userService.findUserByNickname(nickname),
    ]);
    if (email && nickname) exist = (existEmail ?? 0) === (existNickname ?? 1);
    else if (email) exist = !!existEmail;
    else exist = !!existNickname;
    return { exist };
  }

  @Get(':userId')
  async findUserById(@Param() { userId }: UserIdDto): Promise<User> {
    return await this.userService.findUserById(userId);
  }

  @UseGuards(JwtAuthGuard)
  @Put()
  async updateUser(
    @Body() updateUserDto: UpdateUserDto,
  ): Promise<StatusResponse> {
    return await this.userService.updateUser(updateUserDto);
  }

  @UseGuards(JwtAuthGuard)
  @Delete()
  async deleteUser(@Req() req: any): Promise<StatusResponse> {
    const { id } = req.user;
    return await this.userService.deleteUser(id);
  }
}
