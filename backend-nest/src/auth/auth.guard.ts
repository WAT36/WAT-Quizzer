import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Request } from 'express';
import { CognitoJwtVerifier } from 'aws-jwt-verify';

@Injectable()
export class AuthGuard implements CanActivate {
  async canActivate(context: ExecutionContext): Promise<boolean> {
    // Verifier that expects valid access tokens:
    const verifier = CognitoJwtVerifier.create({
      userPoolId: process.env.AWS_COGNITO_USERPOOL_ID,
      tokenUse: 'access',
      clientId: process.env.AWS_COGNITO_APPCLIENT_ID,
    });

    const request = context.switchToHttp().getRequest();
    const token =
      process.env.APP_ENV === 'local'
        ? this.extractTokenFromHeader(request)
        : this.extractJWTFromCookie(request);
    if (!token) {
      throw new UnauthorizedException();
    }
    try {
      await verifier.verify(
        token, // the JWT as string
      );
    } catch {
      throw new UnauthorizedException();
    }
    return true;
  }

  private extractTokenFromHeader(request: Request): string | undefined {
    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }

  private extractJWTFromCookie(req: Request): string | null {
    // TODO COGNITO_USERNAMEはやめる　secret managerとかに入れること
    if (req.cookies && req.cookies.apiAccessToken) {
      return req.cookies.apiAccessToken;
    }
    return null;
  }
}
