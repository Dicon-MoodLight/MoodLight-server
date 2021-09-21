import { HttpStatus, Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { JwtService } from '@nestjs/jwt';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import * as nodemailer from 'nodemailer';
import { LoginDto } from './dto/login.dto';
import { User } from '../user/entity/user.entity';
import { UserService } from '../user/user.service';
import { ConfigService } from '@nestjs/config';
import { IStatusResponse } from '../types/response';
import { FAILURE_RESPONSE, SUCCESS_RESPONSE } from '../constants/response';
import { throwHttpException } from '../util/error';
import { JoinDto } from './dto/join.dto';
import { ConfirmDto } from './dto/confirm.dto';
import { Verification } from './entity/verfication.entity';
import { ConfirmChangePasswordNotLoggedInDto } from './dto/confirm-change-password-not-logged-in.dto';
import { FindConditions } from 'typeorm/find-options/FindConditions';
import { ChangePasswordDto } from './dto/change-password.dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
    @InjectRepository(Verification)
    private readonly verificationRepository: Repository<Verification>,
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  async join({
    email,
    password: plain,
    nickname,
    adminKey,
  }: JoinDto): Promise<IStatusResponse> {
    try {
      const joinDataAvailability = await this.checkJoinDataAvailability({
        email,
        nickname,
      });
      if (joinDataAvailability !== 'available') {
        throwHttpException(
          {
            ...FAILURE_RESPONSE,
            message: `${joinDataAvailability} already exists.`,
          },
          HttpStatus.CONFLICT,
        );
      }
      const emailHasVerification = await this.verificationRepository.findOne({
        email,
        mode: 'join',
      });
      const confirmCode = AuthService.createConfirmCode();
      const password = await AuthService.encryptPassword(plain);
      const verificationDto = {
        email,
        nickname,
        confirmCode,
        user: JSON.stringify({
          password,
          is_admin: adminKey === this.configService.get<string>('ADMIN_KEY'),
        }),
      };
      if (emailHasVerification) {
        await this.verificationRepository.update(
          emailHasVerification.id,
          verificationDto,
        );
      } else {
        const newVerification = await this.verificationRepository.create(
          verificationDto,
        );
        await this.verificationRepository.save(newVerification);
      }
      await this.sendConfirmEmail(email, confirmCode);
    } catch (err) {
      throwHttpException(FAILURE_RESPONSE, HttpStatus.CONFLICT, err);
    }
    return SUCCESS_RESPONSE;
  }

  private async checkJoinDataAvailability({
    email,
    nickname,
  }): Promise<'Email' | 'Nickname' | 'available'> {
    const verificationIsExist = this.verificationRepository.findOne({
      nickname,
    });
    const nicknameIsExist = this.userService.findUserByNickname(nickname);
    const emailIsExist = this.userService.findUserByEmail(email);
    if (
      (await nicknameIsExist) ||
      (await emailIsExist) ||
      (await verificationIsExist)?.email
    ) {
      return emailIsExist ? 'Email' : 'Nickname';
    }
    return 'available';
  }

  async confirm(confirmDto: ConfirmDto): Promise<IStatusResponse> {
    try {
      const verification = await this.verificationRepository.findOne({
        ...confirmDto,
        mode: 'join',
      });
      if (!verification) {
        throwHttpException(
          {
            ...FAILURE_RESPONSE,
            message: 'Verification does not exists.',
          },
          HttpStatus.BAD_REQUEST,
        );
      }
      const { email, nickname, user } = verification;
      const newUser = this.userRepository.create({
        email,
        nickname,
        ...JSON.parse(user),
      });
      await this.userRepository.save(newUser);
    } catch (err) {
      throwHttpException(FAILURE_RESPONSE, HttpStatus.CONFLICT, err);
    }
    return SUCCESS_RESPONSE;
  }

  async login({ email, password: plain }: LoginDto): Promise<User> {
    const password = await this.findUserPassword({ email });
    const isMatch = await bcrypt.compare(plain, password);
    if (isMatch) {
      return await this.userService.findUserByEmail(email);
    }
    throw new UnauthorizedException();
  }

  async changePassword({
    userId: id,
    password: plain,
    newPassword,
  }: ChangePasswordDto): Promise<IStatusResponse> {
    try {
      const password = await this.findUserPassword({ id });
      if (!password) {
        throwHttpException(
          { ...FAILURE_RESPONSE, message: 'User does not exist.' },
          HttpStatus.BAD_REQUEST,
        );
      }
      const isMatch = await bcrypt.compare(plain, password);
      if (!isMatch) {
        throwHttpException(
          { ...FAILURE_RESPONSE, message: 'Unauthorized.' },
          HttpStatus.UNAUTHORIZED,
        );
      }
      await this.userRepository.update(id, { password: newPassword });
    } catch (err) {
      throwHttpException(FAILURE_RESPONSE, HttpStatus.CONFLICT, err);
    }
    return SUCCESS_RESPONSE;
  }

  private async findUserPassword(where: FindConditions<User>): Promise<string> {
    return (await this.userRepository.findOne({ where, select: ['password'] }))
      ?.password;
  }

  async changePasswordNotLoggedIn(email): Promise<IStatusResponse> {
    try {
      const user = await this.userService.findUserByEmail(email);
      if (!user) {
        throwHttpException(
          { ...FAILURE_RESPONSE, message: 'User email does not exist.' },
          HttpStatus.BAD_REQUEST,
        );
      }
      const confirmCode = AuthService.createConfirmCode();
      const newVerification = await this.verificationRepository.create({
        email,
        confirmCode,
        mode: 'change_password',
      });
      await this.verificationRepository.save(newVerification);
      await this.sendConfirmEmail(email, confirmCode);
    } catch (err) {
      throwHttpException(FAILURE_RESPONSE, HttpStatus.CONFLICT, err);
    }
    return SUCCESS_RESPONSE;
  }

  async confirmChangePasswordNotLoggedIn({
    email,
    confirmCode,
    password,
  }: ConfirmChangePasswordNotLoggedInDto): Promise<IStatusResponse> {
    try {
      const verification = await this.verificationRepository.findOne({
        email,
        confirmCode,
        mode: 'change_password',
      });
      if (!verification) {
        throwHttpException(
          { ...FAILURE_RESPONSE, message: 'Verification does not exists.' },
          HttpStatus.BAD_REQUEST,
        );
      }
      await this.updateUserPassword(email, password);
    } catch (err) {
      throwHttpException(FAILURE_RESPONSE, HttpStatus.CONFLICT, err);
    }
    return SUCCESS_RESPONSE;
  }

  private async updateUserPassword(email, plainPassword): Promise<void> {
    const password = await AuthService.encryptPassword(plainPassword);
    await this.userRepository.update({ email }, { password });
  }

  createJwtAccessToken({ id, email }): string {
    return this.jwtService.sign({ id, email });
  }

  private static async encryptPassword(plain: string): Promise<string> {
    const salt = await bcrypt.genSalt(12);
    return await bcrypt.hash(plain, salt);
  }

  transporter = nodemailer.createTransport({
    service: this.configService.get<string>('EMAIL_SERVICE'),
    host: this.configService.get<string>('EMAIL_HOST'),
    port: this.configService.get<string>('EMAIL_PORT'),
    auth: {
      user: this.configService.get<string>('EMAIL_ADDRESS'),
      pass: this.configService.get<string>('EMAIL_PASSWORD'),
    },
  } as any);

  private static createConfirmCode(): string {
    const CHARS = '0123456789';
    const VERIFY_NUMBER_LENGTH = 6;
    let verifyNumber = '';
    for (let i = 0; i < VERIFY_NUMBER_LENGTH; i++) {
      const n = Math.floor(Math.random() * CHARS.length);
      verifyNumber += CHARS.substring(n, n + 1);
    }
    return verifyNumber;
  }

  private async sendConfirmEmail(email, confirmCode): Promise<void> {
    await this.transporter.sendMail({
      from: this.configService.get<string>('EMAIL_ADDRESS'),
      to: email,
      subject: '[무드등] 이메일 인증이 필요합니다',
      html: `인증번호: ${confirmCode}`,
    });
  }
}
