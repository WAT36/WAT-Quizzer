import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { EnglishDerivativesService } from './derivatives.service';
import { CognitoAuthGuard } from 'src/auth/cognito/cognito-auth.guard';
import { ApiOperation, ApiTags } from '@nestjs/swagger';

@ApiTags('英単語')
@UseGuards(CognitoAuthGuard)
@Controller('english/derivatives')
export class EnglishDerivativesController {
  constructor(private readonly derivativesService: EnglishDerivativesService) {}

  @ApiOperation({ summary: '英単語の派生語を品詞ごとに取得する' })
  @Get()
  async getDerivatives(@Query('word') word: string) {
    return await this.derivativesService.getDerivatives(word);
  }
}
