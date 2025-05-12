import {
  Controller,
  Post,
  Body,
  Get,
  UseGuards,
  Request,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { VerifyEmailDto } from './dto/verify-email.dto';
import { User } from './entities/user.entity';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post('register')
  async create(@Body() createUserDto: CreateUserDto): Promise<User> {
    return this.usersService.create(createUserDto);
  }

  @Post('verify-email')
  async verifyEmail(@Body() verifyEmailDto: VerifyEmailDto): Promise<User> {
    return this.usersService.verifyEmail(verifyEmailDto);
  }

  @Post('resend-verification')
  async resendVerificationCode(@Body('email') email: string): Promise<boolean> {
    return this.usersService.resendVerificationCode(email);
  }

  @UseGuards(JwtAuthGuard)
  @Get('profile')
  async getProfile(@Request() req): Promise<User> {
    return this.usersService.getProfile(req.user.sub);
  }
}
