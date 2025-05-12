import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { UsersService } from '../users/users.service';
import { LoginDto } from './dto/login.dto';
import { JwtPayload, TokenType } from './types/jwt-payload.type';
import { ENV_VARIABLE_KEYS } from 'src/common/config/env.validation';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}

  private createPayload(
    user: { id: string; email: string },
    type: TokenType,
  ): JwtPayload {
    return {
      sub: user.id,
      email: user.email,
      type,
    };
  }

  private async issueToken(
    payload: JwtPayload,
    isRefreshToken: boolean,
  ): Promise<string> {
    const secret = this.configService.get<string>(
      isRefreshToken
        ? ENV_VARIABLE_KEYS.JWT_REFRESH_SECRET
        : ENV_VARIABLE_KEYS.JWT_SECRET,
    );

    const expiresIn = isRefreshToken
      ? this.configService.get<string>(ENV_VARIABLE_KEYS.JWT_REFRESH_EXPIRES_IN)
      : this.configService.get<string>(ENV_VARIABLE_KEYS.JWT_EXPIRES_IN);

    return this.jwtService.signAsync(payload, {
      secret,
      expiresIn: expiresIn,
    });
  }

  async login(loginDto: LoginDto) {
    const { email, password } = loginDto;

    const user = await this.usersService.validateUser(email, password);
    if (!user) {
      throw new UnauthorizedException(
        '이메일 또는 비밀번호가 올바르지 않습니다.',
      );
    }

    if (!user.isEmailVerified) {
      throw new UnauthorizedException('이메일 인증이 필요합니다.');
    }

    const [accessPayload, refreshPayload] = [
      this.createPayload(user, 'access'),
      this.createPayload(user, 'refresh'),
    ];

    const [accessToken, refreshToken] = await Promise.all([
      this.issueToken(accessPayload, false),
      this.issueToken(refreshPayload, true),
    ]);

    return {
      accessToken,
      refreshToken,
    };
  }

  async refreshToken(refreshToken: string) {
    try {
      const payload = await this.jwtService.verifyAsync<JwtPayload>(
        refreshToken,
        {
          secret: this.configService.get<string>(
            ENV_VARIABLE_KEYS.JWT_REFRESH_SECRET,
          ),
        },
      );

      if (payload.type !== 'refresh') {
        throw new UnauthorizedException('유효하지 않은 토큰입니다.');
      }

      const user = await this.usersService.findById(payload.sub);
      if (!user) {
        throw new UnauthorizedException('유효하지 않은 토큰입니다.');
      }

      const newPayload = this.createPayload(user, 'access');
      const newAccessToken = await this.issueToken(newPayload, false);

      return {
        accessToken: newAccessToken,
      };
    } catch (error) {
      console.error(error);
      throw new UnauthorizedException('유효하지 않은 토큰입니다.');
    }
  }
}
