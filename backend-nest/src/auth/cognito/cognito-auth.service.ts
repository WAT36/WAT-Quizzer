import {
  AuthFlowType,
  ChallengeNameType,
  CognitoIdentityProviderClient,
  InitiateAuthCommand,
  RespondToAuthChallengeCommand,
  RevokeTokenCommand,
} from '@aws-sdk/client-cognito-identity-provider';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import * as jwt from 'jsonwebtoken';
import jwksClient from 'jwks-rsa';
import * as dotenv from 'dotenv';
dotenv.config();

const REGION = process.env.REGION;
const USER_POOL_ID = process.env.AWS_COGNITO_USERPOOL_ID;
const CLIENT_ID = process.env.AWS_COGNITO_APPCLIENT_ID;
const COGNITO_ISSUER = `https://cognito-idp.${REGION}.amazonaws.com/${USER_POOL_ID}`;

// JWKSクライアント作成
const client = jwksClient({
  jwksUri: `${COGNITO_ISSUER}/.well-known/jwks.json`,
});

function getKey(header, callback) {
  client.getSigningKey(header.kid, (err, key) => {
    if (err) {
      return callback(err);
    }
    callback(null, key?.getPublicKey());
  });
}

const cognitoClient = new CognitoIdentityProviderClient({ region: REGION });

// サインイン系APIの結果（refreshTokenはCookieに入れるためコントローラ側で取り出す）
export type CognitoSignInResult =
  | { status: 'SUCCESS'; accessToken: string; refreshToken?: string }
  | {
      status: 'NEW_PASSWORD_REQUIRED';
      session: string;
      username: string;
    };

@Injectable()
export class CognitoAuthService {
  async verifyAccessToken(token: string): Promise<any> {
    return new Promise((resolve, reject) => {
      jwt.verify(
        token,
        getKey,
        {
          issuer: COGNITO_ISSUER,
          algorithms: ['RS256'],
        },
        (err, decoded: any) => {
          if (err || !decoded) {
            return reject(
              new UnauthorizedException('Invalid or expired token'),
            );
          }
          if (decoded.token_use !== 'access') {
            return reject(
              new UnauthorizedException('Token is not an access token'),
            );
          }

          if (decoded.client_id !== CLIENT_ID) {
            return reject(
              new UnauthorizedException('Token was not issued for this client'),
            );
          }

          resolve(decoded);
        },
      );
    });
  }

  async signIn(
    username: string,
    password: string,
  ): Promise<CognitoSignInResult> {
    try {
      const res = await cognitoClient.send(
        new InitiateAuthCommand({
          AuthFlow: AuthFlowType.USER_PASSWORD_AUTH,
          ClientId: CLIENT_ID,
          AuthParameters: { USERNAME: username, PASSWORD: password },
        }),
      );

      if (res.ChallengeName === ChallengeNameType.NEW_PASSWORD_REQUIRED) {
        return {
          status: 'NEW_PASSWORD_REQUIRED',
          session: res.Session ?? '',
          username,
        };
      }
      if (!res.AuthenticationResult?.AccessToken) {
        throw new Error(`Unsupported challenge: ${res.ChallengeName}`);
      }
      return {
        status: 'SUCCESS',
        accessToken: res.AuthenticationResult.AccessToken,
        refreshToken: res.AuthenticationResult.RefreshToken,
      };
    } catch (err: unknown) {
      throw new UnauthorizedException(
        err instanceof Error ? err.message : 'Sign in failed',
      );
    }
  }

  // サインイン時のNEW_PASSWORD_REQUIREDチャレンジに応答する（sessionはサインイン時に返したもの）
  async completeNewPassword(
    username: string,
    newPassword: string,
    session: string,
  ): Promise<CognitoSignInResult> {
    try {
      const res = await cognitoClient.send(
        new RespondToAuthChallengeCommand({
          ClientId: CLIENT_ID,
          ChallengeName: ChallengeNameType.NEW_PASSWORD_REQUIRED,
          Session: session,
          ChallengeResponses: {
            USERNAME: username,
            NEW_PASSWORD: newPassword,
          },
        }),
      );
      if (!res.AuthenticationResult?.AccessToken) {
        throw new Error(`Unsupported challenge: ${res.ChallengeName}`);
      }
      return {
        status: 'SUCCESS',
        accessToken: res.AuthenticationResult.AccessToken,
        refreshToken: res.AuthenticationResult.RefreshToken,
      };
    } catch (err: unknown) {
      throw new UnauthorizedException(
        err instanceof Error ? err.message : 'Password change failed',
      );
    }
  }

  // refreshTokenで新しいaccessTokenを取得する
  // (refreshTokenのローテーションは使わないので、refreshToken自体の期限はログイン時から固定)
  async refresh(refreshToken: string): Promise<string> {
    try {
      const res = await cognitoClient.send(
        new InitiateAuthCommand({
          AuthFlow: AuthFlowType.REFRESH_TOKEN_AUTH,
          ClientId: CLIENT_ID,
          AuthParameters: { REFRESH_TOKEN: refreshToken },
        }),
      );
      const accessToken = res.AuthenticationResult?.AccessToken;
      if (!accessToken) {
        throw new Error('No access token returned');
      }
      return accessToken;
    } catch (err: unknown) {
      throw new UnauthorizedException(
        err instanceof Error ? err.message : 'Refresh failed',
      );
    }
  }

  // refreshTokenを無効化する（ログアウト時）
  async revoke(refreshToken: string): Promise<void> {
    await cognitoClient.send(
      new RevokeTokenCommand({ ClientId: CLIENT_ID, Token: refreshToken }),
    );
  }
}
