import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from './guard/jwt-auth.guard';
import { AuthService } from './auth.service';
import { IStatusResponse } from '../types/response';
import { SUCCESS_RESPONSE } from '../constants/response';
import { LocalAuthGuard } from './guard/local-auth.guard';
import { ILoginResponse } from './interface/response';
import { JoinDto } from './dto/join.dto';
import { ConfirmDto } from './dto/confirm.dto';
import { ConfirmChangePasswordNotLoggedInDto } from './dto/confirm-change-password-not-logged-in.dto';
import { ChangePasswordDto } from './dto/change-password.dto';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @ApiOperation({ summary: '인증 토큰 검증' })
  @UseGuards(JwtAuthGuard)
  @Get()
  async authorization(): Promise<IStatusResponse> {
    return SUCCESS_RESPONSE;
  }

  @ApiOperation({ summary: '가입 요청' })
  @Post('join')
  async join(@Body() joinDto: JoinDto): Promise<IStatusResponse> {
    return await this.authService.join(joinDto);
  }

  @ApiOperation({ summary: '가입 인증' })
  @Post('confirm')
  async confirm(@Body() confirmDto: ConfirmDto): Promise<IStatusResponse> {
    return await this.authService.confirm(confirmDto);
  }

  @ApiOperation({ summary: '로그인' })
  @UseGuards(LocalAuthGuard)
  @Post('login')
  async login(@Req() req: any): Promise<ILoginResponse> {
    const { id, email } = req.user;
    const accessToken = this.authService.createJwtAccessToken({ id, email });
    return { accessToken };
  }

  @ApiOperation({ summary: '비밀번호 변경' })
  @UseGuards(JwtAuthGuard)
  @Post('change-password')
  async changePassword(
    @Req() req: any,
    @Body() changePasswordDto: ChangePasswordDto,
  ): Promise<IStatusResponse> {
    const { id: userId } = req.user;
    return await this.authService.changePassword({
      ...changePasswordDto,
      userId,
    });
  }

  @ApiOperation({ summary: '비밀번호 찾기' })
  @Post('find-password')
  async findPassword(@Body('email') email: string): Promise<IStatusResponse> {
    return await this.authService.changePasswordNotLoggedIn(email);
  }

  @ApiOperation({ summary: '비밀번호 찾기 인증' })
  @Post('confirm-find-password')
  async confirmFindPassword(
    @Body()
    confirmChangePasswordNotLoggedInDto: ConfirmChangePasswordNotLoggedInDto,
  ): Promise<IStatusResponse> {
    return await this.authService.confirmChangePasswordNotLoggedIn(
      confirmChangePasswordNotLoggedInDto,
    );
  }
}
