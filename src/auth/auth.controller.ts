import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from './guard/jwt-auth.guard';
import { AuthService } from './auth.service';
import { StatusResponse } from '../types/response';
import { LocalAuthGuard } from './guard/local-auth.guard';
import { ILoginResponse } from './interface/response';
import {
  JoinDto,
  ConfirmChangePasswordNotLoggedInDto,
  ConfirmDto,
  ChangePasswordDto,
  SaveFirebaseTokenOfUserDto,
} from './dto';
import { UserEmailDto } from '../user/dto/user-email.dto';
import { User } from '../user/entity/user.entity';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @UseGuards(JwtAuthGuard)
  @Get()
  async authorization(@Req() req: any): Promise<User> {
    return req.user;
  }

  @Post('join')
  async join(@Body() joinDto: JoinDto): Promise<StatusResponse> {
    return await this.authService.join(joinDto);
  }

  @Post('confirm')
  async confirm(@Body() confirmDto: ConfirmDto): Promise<StatusResponse> {
    return await this.authService.confirm(confirmDto);
  }

  @Post('confirm-check')
  async checkConfirmCode(
    @Body() confirmDto: ConfirmDto,
  ): Promise<StatusResponse> {
    return await this.authService.checkConfirmCode(confirmDto);
  }

  @UseGuards(LocalAuthGuard)
  @Post('login')
  async login(
    @Req() req: any,
    @Body() { firebaseToken }: SaveFirebaseTokenOfUserDto,
  ): Promise<ILoginResponse> {
    const { id, email } = req.user;
    await this.authService.saveFirebaseTokenOfUser(id, firebaseToken);
    const accessToken = this.authService.createJwtAccessToken({ id, email });
    return { accessToken };
  }

  @UseGuards(JwtAuthGuard)
  @Post('change-password')
  async changePassword(
    @Req() req: any,
    @Body() changePasswordDto: ChangePasswordDto,
  ): Promise<StatusResponse> {
    const { id: userId } = req.user;
    return await this.authService.changePassword({
      ...changePasswordDto,
      userId,
    });
  }

  @Post('find-password')
  async findPassword(@Body() { email }: UserEmailDto): Promise<StatusResponse> {
    return await this.authService.changePasswordNotLoggedIn(email);
  }

  @Post('confirm-find-password')
  async confirmFindPassword(
    @Body()
    confirmChangePasswordNotLoggedInDto: ConfirmChangePasswordNotLoggedInDto,
  ): Promise<StatusResponse> {
    return await this.authService.confirmChangePasswordNotLoggedIn(
      confirmChangePasswordNotLoggedInDto,
    );
  }
}
