import { Injectable } from '@nestjs/common';
import { CognitoAuthService } from './cognito/cognito-auth.service';

@Injectable()
export class AuthService {
  constructor(private cognitoAuthService: CognitoAuthService) {}

  async signIn(username: string, password: string) {
    return await this.cognitoAuthService.signIn(username, password);
  }

  async completeNewPassword(
    username: string,
    password: string,
    session: string,
  ) {
    return await this.cognitoAuthService.completeNewPassword(
      username,
      password,
      session,
    );
  }

  async refresh(refreshToken: string) {
    return await this.cognitoAuthService.refresh(refreshToken);
  }

  async revoke(refreshToken: string) {
    return await this.cognitoAuthService.revoke(refreshToken);
  }
}
