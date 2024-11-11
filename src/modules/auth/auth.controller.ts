import { Body, Controller, Post } from '@nestjs/common';
import { RegisterDto } from './dto/request/register.dto';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/request/login.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  async register(@Body() registerDto: RegisterDto) {
    const accessToken = await this.authService.register(registerDto);

    return {
      data: accessToken,
    };
  }

  @Post('login')
  async login(@Body() loginDto: LoginDto) {
    const accessToken = await this.authService.login(loginDto);

    return {
      data: accessToken,
    };
  }
}
