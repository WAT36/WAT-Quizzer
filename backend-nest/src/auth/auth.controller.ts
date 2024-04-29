import { Body, Controller, Get, Query } from '@nestjs/common';
import { AuthService } from './auth.service';

// TODO libに持っていく
export interface AuthSigninRequestDto {
  username: string;
  password: string;
}

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}
  @Get('signin')
  async signin(@Body() req: AuthSigninRequestDto) {
    return await this.authService.signIn(req.username, req.password);
  }
}
