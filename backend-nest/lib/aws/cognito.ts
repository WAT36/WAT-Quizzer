import {
  AuthFlowType,
  CognitoIdentityProviderClient,
  InitiateAuthCommand,
} from '@aws-sdk/client-cognito-identity-provider';
import { Injectable } from '@nestjs/common';
import { SignInResultResponse } from 'src/auth/auth.service';

@Injectable()
export class CognitoService {
  readonly cognitoClient;
  constructor() {
    this.cognitoClient = new CognitoIdentityProviderClient({
      region: process.env.AWS_REGION || '',
    });
  }

  async signIn(username: string, pass: string): Promise<SignInResultResponse> {
    const input = {
      // TODO USER_SRP_AUTHにする MFA?
      AuthFlow: AuthFlowType.USER_PASSWORD_AUTH,
      ClientId: process.env.AWS_COGNITO_APPCLIENT_ID,
      AuthParameters: {
        PASSWORD: pass,
        USERNAME: username,
      },
    };
    const command = new InitiateAuthCommand(input);
    // TODO パスワード違いエラー(400)が返されない（全部ステータス500になる？）ので調査
    const initiateAuthResult = await this.cognitoClient.send(command);

    // TODO: Generate a JWT and return it here
    // instead of the user object
    return {
      accessToken: initiateAuthResult.AuthenticationResult.AccessToken,
      idToken: initiateAuthResult.AuthenticationResult.IdToken,
      refreshToken: initiateAuthResult.AuthenticationResult.RefreshToken,
    };
  }
}
