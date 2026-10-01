import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Request } from 'express';
import { CognitoAuthService } from './cognito-auth.service';

@Injectable()
export class CognitoAuthGuard implements CanActivate {
  constructor(private readonly cognitoAuthService: CognitoAuthService) {}

  // 認証失敗時は401を返す（フロントは401を受けてトークン再取得→再ログインを行う）
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const req = context.switchToHttp().getRequest<Request>();
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new UnauthorizedException('No access token');
    }

    const token = authHeader.replace('Bearer ', '');
    const user = await this.cognitoAuthService.verifyAccessToken(token);
    req['user'] = user;
    return true;
  }
}
