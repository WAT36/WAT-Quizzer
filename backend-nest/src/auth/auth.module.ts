import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { CognitoService } from 'lib/aws/cognito';

@Module({
  controllers: [AuthController],
  providers: [AuthService, CognitoService],
})
export class AuthModule {}
