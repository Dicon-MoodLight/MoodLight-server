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
import {
  ApiBearerAuth,
  ApiBody,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { User } from './entity/user.entity';
import { UserService } from './user.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { ExistResponse, StatusResponse } from '../types/response';
import { JwtAuthGuard } from '../auth/guard/jwt-auth.guard';
import { StatusResponseDto } from '../constants/response';
import { UserIdDto } from './dto/user-id.dto';
import { GetUserIsExistDto } from './dto/get-user-is-exist.dto';

@ApiTags('User')
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @ApiOperation({ summary: '사용자 이메일 or 닉네임 가입 여부 확인' })
  @ApiResponse({ status: 200, description: 'exist: boolean;' })
  @Get('exist')
  async getUserIsExist(
    @Query() { email, nickname }: GetUserIsExistDto,
  ): Promise<ExistResponse> {
    if (!email && !nickname) throw ConflictException;
    return {
      exist:
        email && nickname
          ? ((await this.userService.findUserByEmail(email))?.id ?? 0) ===
            ((await this.userService.findUserByNickname(nickname))?.id ?? 1)
          : email
          ? !!(await this.userService.findUserByEmail(email))
          : !!(await this.userService.getUserNicknameIsExist(nickname)),
    };
  }

  @ApiOperation({ summary: '다른 사용자 정보 가져오기' })
  @ApiResponse({ status: 200, type: User })
  @Get(':userId')
  async findUserById(@Param() { userId }: UserIdDto): Promise<User> {
    return await this.userService.findUserById(userId);
  }

  @ApiOperation({ summary: '사용자 정보 업데이트' })
  @ApiBody({ type: UpdateUserDto })
  @ApiResponse({ type: StatusResponseDto })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Put()
  async updateUser(
    @Body() updateUserDto: UpdateUserDto,
  ): Promise<StatusResponse> {
    return await this.userService.updateUser(updateUserDto);
  }

  @ApiOperation({ summary: '사용자 탈퇴' })
  @ApiResponse({ type: StatusResponseDto })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Delete()
  async deleteUser(@Req() req: any): Promise<StatusResponse> {
    const { id } = req.user;
    return await this.userService.deleteUser(id);
  }
}
