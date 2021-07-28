import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import * as nodemailer from 'nodemailer';
import { LoginDto } from './dto/login.dto';
import { User } from '../user/entity/user.entity';
import { UserService } from '../user/user.service';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  async login({ email, password: plain }: LoginDto): Promise<User> {
    const { password } = await this.userRepository.findOne({
      where: { email },
      select: ['password'],
    });
    const isMatch = await bcrypt.compare(plain, password);
    if (isMatch) {
      return await this.userService.findUserByEmail(email);
    }
    throw new UnauthorizedException();
  }

  createJwtAccessToken({ id, email }): string {
    return this.jwtService.sign({ id, email });
  }

  private async encryptPassword(plain: string): Promise<string> {
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

  private async sendVerificationEmail(email, confirmCode): Promise<void> {
    await this.transporter.sendMail({
      from: this.configService.get<string>('EMAIL_ADDRESS'),
      to: email,
      subject: '[무드등] 이메일 인증이 필요합니다',
      html: `인증번호: ${confirmCode}`,
    });
  }
}
