import { Body, Controller, Post } from '@nestjs/common';
import { RegisterDto } from './dto/request/register.dto';
import { AuthService } from './auth.service';
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  async register(@Body() registerDto: RegisterDto) {
    const createdUser = await this.authService.register(registerDto);

    return {
      statusCode: 201,
      message: 'User created',
      data: createdUser,
    };
  }
}
