import { Body, Controller, Post } from '@nestjs/common';
import { AuthDto } from './dto/auth.dto';
import { LoginDto } from './dto/login.dto';
import { LoginService } from './services/login/login.service';
import { RegisterDto } from './dto/register.dto';
import { RegisterService } from './services/register/register.service';
import { LoginSwagger } from './swagger/login.swagger';
import { RegisterSwagger } from './swagger/register.swagger';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly loginService: LoginService,
    private readonly registerService: RegisterService,
  ) {}

  @LoginSwagger()
  @Post('login')
  async login(@Body() body: LoginDto): Promise<AuthDto> {
    return this.loginService.execute(body);
  }

  @RegisterSwagger()
  @Post('register')
  async register(@Body() body: RegisterDto): Promise<AuthDto> {
    return this.registerService.execute(body);
  }
}
