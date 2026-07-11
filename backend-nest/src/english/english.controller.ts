import {
  Body,
  Controller,
  Get,
  ParseBoolPipe,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { EnglishService } from './english.service';
import {
  AddExampleAPIRequestDto,
  RegisterWordsToSourceDto,
  SubmitAssociationExampleAPIRequestDto,
  SubmitExampleTestDataAPIRequestDto,
} from 'quizzer-lib';
import { CognitoAuthGuard } from 'src/auth/cognito/cognito-auth.guard';
import { ApiOperation, ApiTags } from '@nestjs/swagger';

@ApiTags('english')
@UseGuards(CognitoAuthGuard)
@Controller('english')
export class EnglishController {
  constructor(private readonly englishService: EnglishService) {}

  @ApiOperation({ summary: '品詞リストを取得する' })
  @Get('/partsofspeech')
  async getPosList() {
    return await this.englishService.getPartsofSpeechService();
  }

  @ApiOperation({ summary: '出典リストを取得する' })
  @Get('/source')
  async getSourceList() {
    return await this.englishService.getSourceService();
  }

  @ApiOperation({ summary: '例文を追加する' })
  @Post('/example')
  async addExample(@Body() req: AddExampleAPIRequestDto) {
    return await this.englishService.addExampleService(req);
  }

  @ApiOperation({ summary: '例文を検索する' })
  @Get('/example')
  async searchExample(
    @Query('query') query: string,
    @Query('isLinked', ParseBoolPipe) isLinked: boolean,
  ) {
    return await this.englishService.searchExampleService(query, isLinked);
  }

  @ApiOperation({ summary: '例文の紐付けを変更する' })
  @Post('/example/association')
  async changeAssociationOfExample(
    @Body() req: SubmitAssociationExampleAPIRequestDto,
  ) {
    return await this.englishService.changeAssociationOfExampleService(req);
  }

  @ApiOperation({ summary: '例文テストデータを取得する' })
  @Get('/example/test')
  async getExampleTest(@Query('sourceId') sourceId?: string) {
    return await this.englishService.getExampleTestService(
      sourceId !== undefined ? +sourceId : undefined,
    );
  }

  @ApiOperation({ summary: '例文テストを正解として記録' })
  @Post('/example/test/clear')
  async exampleTestCleared(@Body() req: SubmitExampleTestDataAPIRequestDto) {
    return await this.englishService.exampleTestClearedService(req);
  }

  @ApiOperation({ summary: '例文テストを不正解として記録' })
  @Post('/example/test/fail')
  async exampleTestFailed(@Body() req: SubmitExampleTestDataAPIRequestDto) {
    return await this.englishService.exampleTestFailedService(req);
  }

  @ApiOperation({ summary: '出典ごとの統計情報を取得する' })
  @Get('source/statistics')
  async getSourceStatistics() {
    return await this.englishService.getSourceStatisticsData();
  }

  // バッチ用
  @ApiOperation({ summary: '出典に単語を登録する（バッチ用）' })
  @Post('source/words')
  async registerWordsToSource(
    @Body() registerWordsToSourceDto: RegisterWordsToSourceDto,
  ) {
    return await this.englishService.registerWordsToSource(
      +registerWordsToSourceDto.sourceId,
      registerWordsToSourceDto.words,
    );
  }
}
