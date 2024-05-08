import { Body, Controller, Post, Res } from '@nestjs/common';
import { AuthService } from './auth.service';
import { Response } from 'express';

// TODO libに持っていく
export interface AuthSigninRequestDto {
  username: string;
  password: string;
}

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}
  // TODO このレスポンスステータスが201になる？200が正しいのでできれば治す
  @Post('signin')
  async signin(
    @Body() req: AuthSigninRequestDto,
    @Res({ passthrough: true }) response: Response,
  ) {
    const signInResult = await this.authService.signIn(
      req.username,
      req.password,
    );
    const cookieProperties = {
      signed: false,
      httpOnly: true,
      path: '/',
      secure: true,
    };
    response.cookie(
      `apiAccessToken`,
      signInResult.accessToken,
      cookieProperties,
    );
    response.cookie(`apiIdToken`, signInResult.idToken, cookieProperties);
    response.cookie(
      `apiRefreshToken`,
      signInResult.refreshToken,
      cookieProperties,
    );
    return signInResult;
  }
}
