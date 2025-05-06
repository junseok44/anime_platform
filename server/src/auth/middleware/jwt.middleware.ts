import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class JwtMiddleware implements NestMiddleware {
  constructor(private jwtService: JwtService) {}

  async use(req: Request, res: Response, next: NextFunction) {
    const token = this.extractTokenFromHeader(req);

    if (token) {
      try {
        const payload = await this.jwtService.verifyAsync(token);
        req['user'] = payload;
      } catch {
        // 토큰이 유효하지 않더라도 미들웨어에서는 에러를 던지지 않고 넘어갑니다.
        // 실제 인증이 필요한 엔드포인트는 가드에서 처리합니다.
      }
    }

    next();
  }

  private extractTokenFromHeader(request: Request): string | undefined {
    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }
}
