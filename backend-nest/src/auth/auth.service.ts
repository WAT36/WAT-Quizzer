import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import {
  CognitoService,
  SignInResultResponse,
} from './cognito/cognito.service';

@Injectable()
export class AuthService {
  constructor(private cognitoService: CognitoService) {}

  async signIn(username: string, pass: string): Promise<SignInResultResponse> {
    try {
      return this.cognitoService.signIn(username, pass);
    } catch (error: unknown) {
      if (error instanceof Error) {
        throw new HttpException(
          error.message,
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }
    }
  }
}
