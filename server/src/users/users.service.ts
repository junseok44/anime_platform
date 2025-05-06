import {
  Injectable,
  ConflictException,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcryptjs from 'bcryptjs';
import { User } from './entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { VerifyEmailDto } from './dto/verify-email.dto';
import { EmailService } from '../email/email.service';
import { randomBytes } from 'crypto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    private emailService: EmailService,
  ) {}

  private generateVerificationCode(): { code: string; expiresAt: Date } {
    const code = randomBytes(3).toString('hex').toUpperCase();
    const expiresAt = new Date();
    expiresAt.setHours(expiresAt.getHours() + 1);
    return { code, expiresAt };
  }

  private async sendVerificationEmail(user: User): Promise<void> {
    await this.emailService.sendVerificationEmail(
      user.email,
      user.emailVerificationCode,
    );
  }

  async create(createUserDto: CreateUserDto): Promise<User> {
    const existingUser = await this.usersRepository.findOne({
      where: [
        { email: createUserDto.email },
        { nickname: createUserDto.nickname },
      ],
    });

    if (existingUser) {
      if (existingUser.email === createUserDto.email) {
        throw new ConflictException('이미 사용 중인 이메일입니다.');
      }
      if (existingUser.nickname === createUserDto.nickname) {
        throw new ConflictException('이미 사용 중인 닉네임입니다.');
      }
    }

    const hashedPassword = await bcryptjs.hash(createUserDto.password, 10);
    const { code, expiresAt } = this.generateVerificationCode();

    const user = this.usersRepository.create({
      ...createUserDto,
      password: hashedPassword,
      emailVerificationCode: code,
      emailVerificationCodeExpires: expiresAt,
    });

    await this.usersRepository.save(user);
    // await this.sendVerificationEmail(user);

    return user;
  }

  async verifyEmail(verifyEmailDto: VerifyEmailDto): Promise<User> {
    const { email, code } = verifyEmailDto;

    const user = await this.findByEmail(email);
    if (!user) {
      throw new NotFoundException('사용자를 찾을 수 없습니다.');
    }

    if (user.isEmailVerified) {
      throw new BadRequestException('이미 인증된 이메일입니다.');
    }

    if (user.emailVerificationCode !== code) {
      throw new BadRequestException('잘못된 인증 코드입니다.');
    }

    if (user.emailVerificationCodeExpires < new Date()) {
      throw new BadRequestException('인증 코드가 만료되었습니다.');
    }

    user.isEmailVerified = true;
    user.emailVerificationCode = null;
    user.emailVerificationCodeExpires = null;

    return this.usersRepository.save(user);
  }

  async resendVerificationCode(email: string): Promise<User> {
    const user = await this.findByEmail(email);
    if (!user) {
      throw new NotFoundException('사용자를 찾을 수 없습니다.');
    }

    if (user.isEmailVerified) {
      throw new BadRequestException('이미 인증된 이메일입니다.');
    }

    const { code, expiresAt } = this.generateVerificationCode();
    user.emailVerificationCode = code;
    user.emailVerificationCodeExpires = expiresAt;

    await this.usersRepository.save(user);
    await this.sendVerificationEmail(user);

    return user;
  }

  async findById(id: string): Promise<User | null> {
    return this.usersRepository.findOne({ where: { id } });
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.usersRepository.findOne({ where: { email } });
  }

  async validateUser(email: string, password: string): Promise<User | null> {
    const user = await this.findByEmail(email);
    if (!user) {
      return null;
    }

    const isPasswordValid = await bcryptjs.compare(password, user.password);
    if (!isPasswordValid) {
      return null;
    }

    return user;
  }

  async getProfile(id: string): Promise<User> {
    const user = await this.findById(id);
    if (!user) {
      throw new NotFoundException('사용자를 찾을 수 없습니다.');
    }
    return user;
  }
}
