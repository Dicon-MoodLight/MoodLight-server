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
} from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { User } from './entity/user.entity';
import { UserService } from './user.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { ExistResponse, StatusResponse } from '../types/response';
import { GetUserIsExistDto } from './dto/get-user-is-exist.dto';
import { JwtAuthGuard } from '../auth/guard/jwt-auth.guard';
import { StatusResponseDto } from '../constants/response';

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
    return {
      exist: nickname
        ? await this.userService.getUserNicknameIsExist(email, nickname)
        : !!(await this.userService.findUserByEmail(email)),
    };
  }

  @ApiOperation({ summary: '사용자 정보 가져오기' })
  @ApiResponse({ status: 200, type: User })
  @Get(':id')
  async findUserById(@Param() id: string): Promise<User> {
    return await this.userService.findUserById(id);
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
