import { Injectable } from '@nestjs/common';
import { CognitoService } from 'lib/aws/cognito';

@Injectable()
export class AuthService {
  constructor(private cognitoService: CognitoService) {}

  async signIn(username: string, pass: string): Promise<any> {
    return this.cognitoService.signIn(username, pass);
  }
}
