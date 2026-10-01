import {
  Body,
  Controller,
  Post,
  HttpCode,
  HttpStatus,
  Req,
  Res,
  UnauthorizedException,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { CookieOptions, Request, Response } from 'express';
import { AuthService } from './auth.service';
import { AuthSigninRequestDto, SignInResult } from 'quizzer-lib';
import { CognitoSignInResult } from './cognito/cognito-auth.service';

// refreshTokenを入れるCookie。JSから読めないようHttpOnlyにし、/auth配下へのリクエストにだけ送らせる
const REFRESH_TOKEN_COOKIE = 'quizzer_refresh_token';
// Cognitoアプリクライアントのリフレッシュトークン有効期限(infra/lib/stack/frontend-stack.ts)と合わせる
const REFRESH_TOKEN_MAX_AGE_MS = 6 * 60 * 60 * 1000;
const refreshTokenCookieOptions: CookieOptions = {
  httpOnly: true,
  // ローカル(http://localhost)ではSecure Cookieを扱えないブラウザがあるため外す
  secure: process.env.APP_ENV !== 'local',
  // フロント(dev.quizzer.wat-notes.com)とAPI(dev.api.quizzer.wat-notes.com)は同一サイトなのでLaxで送られる
  sameSite: 'lax',
  path: '/auth',
};

@ApiTags('認証')
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('signin')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'サインイン',
    description:
      'ユーザー名とパスワードでサインインします。成功時はrefreshTokenをHttpOnly Cookieにセットし、accessTokenを返します。パスワード変更が必要な場合はNEW_PASSWORD_REQUIREDを返します。',
  })
  @ApiResponse({
    status: 200,
    description: 'サインイン成功またはパスワード変更要求。',
  })
  async signin(
    @Body() req: AuthSigninRequestDto,
    @Res({ passthrough: true }) res: Response,
  ): Promise<SignInResult> {
    const result = await this.authService.signIn(req.username, req.password);
    return this.toSignInResponse(result, res);
  }

  @Post('newpassword')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: '新しいパスワードの設定',
    description:
      '初回サインイン時など、パスワード変更が必要な場合に新しいパスワードを設定します。',
  })
  @ApiResponse({
    status: 200,
    description: '新しいパスワード設定後のサインイン成功。',
  })
  async completeNewPassword(
    @Body() req: AuthSigninRequestDto,
    @Res({ passthrough: true }) res: Response,
  ): Promise<SignInResult> {
    const result = await this.authService.completeNewPassword(
      req.username,
      req.password,
      req.session ?? '',
    );
    return this.toSignInResponse(result, res);
  }

  @Post('refresh')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'アクセストークンの再取得',
    description:
      'Cookieのrefreshトークンで新しいaccessTokenを取得します。refreshトークンが無い・期限切れの場合は401を返します。',
  })
  @ApiResponse({ status: 200, description: '再取得成功。' })
  @ApiResponse({ status: 401, description: '再ログインが必要。' })
  async refresh(
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
  ): Promise<{ accessToken: string }> {
    const refreshToken = req.cookies?.[REFRESH_TOKEN_COOKIE];
    if (!refreshToken) {
      throw new UnauthorizedException('No refresh token');
    }
    try {
      const accessToken = await this.authService.refresh(refreshToken);
      return { accessToken };
    } catch (err) {
      res.clearCookie(REFRESH_TOKEN_COOKIE, refreshTokenCookieOptions);
      throw err;
    }
  }

  @Post('logout')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'ログアウト',
    description: 'refreshトークンを無効化し、Cookieを削除します。',
  })
  @ApiResponse({ status: 200, description: 'ログアウト成功。' })
  async logout(
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
  ): Promise<{ status: 'SUCCESS' }> {
    const refreshToken = req.cookies?.[REFRESH_TOKEN_COOKIE];
    res.clearCookie(REFRESH_TOKEN_COOKIE, refreshTokenCookieOptions);
    if (refreshToken) {
      try {
        await this.authService.revoke(refreshToken);
      } catch (err) {
        // 既に失効しているなどで失敗してもCookieは消えているのでログアウト扱いにする
        console.warn('Revoke refresh token failed', err);
      }
    }
    return { status: 'SUCCESS' };
  }

  private toSignInResponse(
    result: CognitoSignInResult,
    res: Response,
  ): SignInResult {
    if (result.status !== 'SUCCESS') {
      return result;
    }
    if (result.refreshToken) {
      res.cookie(REFRESH_TOKEN_COOKIE, result.refreshToken, {
        ...refreshTokenCookieOptions,
        maxAge: REFRESH_TOKEN_MAX_AGE_MS,
      });
    }
    return { status: 'SUCCESS', accessToken: result.accessToken };
  }
}
