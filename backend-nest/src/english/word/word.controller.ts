import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { EnglishWordService } from './word.service';
import {
  EditWordSourceAPIRequestDto,
  EditWordMeanAPIRequestDto,
  EditWordSubSourceAPIRequestDto,
  DeleteWordSubSourceAPIRequestDto,
  DeleteWordSourceAPIRequestDto,
  DeleteMeanAPIRequestDto,
  AddSynonymAPIRequestDto,
  AddAntonymAPIRequestDto,
  AddDerivativeAPIRequestDto,
  LinkWordEtymologyAPIRequestDto,
  AddEtymologyAPIRequestDto,
  ToggleCheckAPIRequestDto,
  AddWordAPIRequestDto,
  SubmitEnglishWordTestDataAPIRequestDto,
  SearchWordAPIRequestDto,
  GetEnglishWordTestDataAPIRequestDto,
} from 'quizzer-lib';
import { EnglishWordTestService } from './test/test.service';
import { WordTestPipe } from './test/pipe/wordTest.pipe';
import { CognitoAuthGuard } from 'src/auth/cognito/cognito-auth.guard';
import { ApiOperation, ApiTags } from '@nestjs/swagger';

@ApiTags('英単語')
@Controller('english/word')
export class EnglishWordController {
  constructor(
    private readonly englishWordService: EnglishWordService,
    private readonly englishWordTestService: EnglishWordTestService,
  ) {}

  @ApiOperation({ summary: '英単語の総数を取得' })
  @Get('num')
  async getWordNum() {
    return await this.englishWordService.getWordNumService();
  }

  @ApiOperation({ summary: '英単語を追加' })
  @UseGuards(CognitoAuthGuard)
  @Post()
  async addWord(@Body() req: AddWordAPIRequestDto) {
    return await this.englishWordService.addWordAndMeanService(req);
  }

  @ApiOperation({ summary: '英単語を検索' })
  @UseGuards(CognitoAuthGuard)
  @Get('search')
  async searchWord(@Query() req: SearchWordAPIRequestDto) {
    return await this.englishWordService.searchWordService(req);
  }

  @ApiOperation({ summary: 'ランダムな英単語を取得' })
  @UseGuards(CognitoAuthGuard)
  @Get('random')
  async getRandomWord() {
    return await this.englishWordService.getRandomWordService();
  }

  @ApiOperation({ summary: '全ての英単語を取得' })
  @UseGuards(CognitoAuthGuard)
  @Get()
  async getAllWord() {
    return await this.englishWordService.getAllWordService();
  }

  @ApiOperation({ summary: '英単語名で単語を取得' })
  @UseGuards(CognitoAuthGuard)
  @Get('byname')
  async getWordByName(@Query('name') name: string) {
    return await this.englishWordService.getWordByNameService(name);
  }

  @ApiOperation({ summary: '英単語テストデータを取得' })
  @UseGuards(CognitoAuthGuard)
  @Get('test')
  async getEnglishWordTestData(
    @Query(WordTestPipe) req: GetEnglishWordTestDataAPIRequestDto,
  ) {
    return await this.englishWordTestService.getTestData(req);
  }

  @ApiOperation({ summary: '英単語テストをクリアとして記録' })
  @UseGuards(CognitoAuthGuard)
  @Post('test/clear')
  async wordTestCleared(@Body() req: SubmitEnglishWordTestDataAPIRequestDto) {
    return await this.englishWordService.wordTestClearedService(req);
  }

  @ApiOperation({ summary: '英単語テストを失敗として記録' })
  @UseGuards(CognitoAuthGuard)
  @Post('test/fail')
  async wordTestFailed(@Body() req: SubmitEnglishWordTestDataAPIRequestDto) {
    return await this.englishWordService.wordTestFailedService(req);
  }

  @ApiOperation({ summary: '直近1週間の英単語テスト統計を取得' })
  @UseGuards(CognitoAuthGuard)
  @Get('test/statistics/week')
  async getWordTestLogStatisticsPastWeek() {
    return await this.englishWordTestService.getWordTestLogStatisticsPastWeek();
  }

  @ApiOperation({ summary: '英単語の出典情報を編集' })
  @UseGuards(CognitoAuthGuard)
  @Post('source')
  async editSourceOfWordById(@Body() req: EditWordSourceAPIRequestDto) {
    return await this.englishWordService.upsertSourceOfWordById(req);
  }

  @ApiOperation({ summary: '英単語の出典情報を削除' })
  @UseGuards(CognitoAuthGuard)
  @Delete('source')
  async deleteSourceOfWordById(@Body() req: DeleteWordSourceAPIRequestDto) {
    return await this.englishWordService.deleteSourceOfWordById(req);
  }

  @ApiOperation({ summary: '英単語のサブ出典情報を追加・編集' })
  @UseGuards(CognitoAuthGuard)
  @Post('subsource')
  async addSubSourceOfWordById(@Body() req: EditWordSubSourceAPIRequestDto) {
    return await this.englishWordService.upsertSubSourceOfWordById(req);
  }

  @ApiOperation({ summary: '英単語のサブ出典情報を削除' })
  @UseGuards(CognitoAuthGuard)
  @Delete('subsource')
  async deleteSubSourceOfWordById(
    @Body() req: DeleteWordSubSourceAPIRequestDto,
  ) {
    return await this.englishWordService.deleteSubSourceOfWordById(req);
  }

  @ApiOperation({ summary: '英単語の意味を削除' })
  @UseGuards(CognitoAuthGuard)
  @Delete('mean')
  async deleteWordMeanById(@Body() req: DeleteMeanAPIRequestDto) {
    return await this.englishWordService.deleteMeandById(req);
  }

  @ApiOperation({ summary: '英単語の概要情報を取得' })
  @UseGuards(CognitoAuthGuard)
  @Get('summary')
  async getSummary() {
    return await this.englishWordService.getSummary();
  }

  @ApiOperation({ summary: '英単語の類義語を追加' })
  @UseGuards(CognitoAuthGuard)
  @Post('synonym')
  async addSynonym(@Body() req: AddSynonymAPIRequestDto) {
    return await this.englishWordService.addSynonymService(req);
  }

  @ApiOperation({ summary: '英単語の対義語を追加' })
  @UseGuards(CognitoAuthGuard)
  @Post('antonym')
  async addAntonym(@Body() req: AddAntonymAPIRequestDto) {
    return await this.englishWordService.addAntonymService(req);
  }

  @ApiOperation({ summary: '英単語の派生語を追加' })
  @UseGuards(CognitoAuthGuard)
  @Post('derivative')
  async addDerivative(@Body() req: AddDerivativeAPIRequestDto) {
    return await this.englishWordService.addDerivativeService(req);
  }

  @ApiOperation({ summary: '英単語の語源を追加' })
  @UseGuards(CognitoAuthGuard)
  @Post('etymology')
  async addEtymology(@Body() req: AddEtymologyAPIRequestDto) {
    return await this.englishWordService.addEtymologyService(req);
  }

  @ApiOperation({ summary: '英単語と語源を紐付け' })
  @UseGuards(CognitoAuthGuard)
  @Post('etymology/link')
  async linkWordEtymology(@Body() req: LinkWordEtymologyAPIRequestDto) {
    return await this.englishWordService.linkWordEtymologyService(req);
  }

  @ApiOperation({ summary: '英単語のチェック状態を切り替え' })
  @UseGuards(CognitoAuthGuard)
  @Post('check/toggle')
  async toggleCheck(@Body() req: ToggleCheckAPIRequestDto) {
    return await this.englishWordService.toggleCheckService(req);
  }

  /* 注 以下APIは一番最後に置くこと パスが上書きされて全てこのAPIが使われてしまうため */
  @ApiOperation({ summary: 'ID指定で英単語の出典情報を取得' })
  @UseGuards(CognitoAuthGuard)
  @Get(':id/source')
  async getSourceOfWordById(@Param('id') id: string) {
    return await this.englishWordService.getSourceOfWordById(+id);
  }

  @ApiOperation({ summary: 'ID指定で英単語のサブ出典情報を取得' })
  @UseGuards(CognitoAuthGuard)
  @Get(':id/subsource')
  async getSubSourceOfWordById(@Param('id') id: string) {
    return await this.englishWordService.getSubSourceOfWordById(+id);
  }

  @ApiOperation({ summary: 'ID指定で英単語を取得' })
  @UseGuards(CognitoAuthGuard)
  @Get(':id')
  async getWordById(@Param('id') id: string) {
    return await this.englishWordService.getWordByIdService(+id);
  }

  @ApiOperation({ summary: '英単語の意味を編集' })
  @UseGuards(CognitoAuthGuard)
  @Patch(':id')
  async editWordMean(@Body() req: EditWordMeanAPIRequestDto) {
    return await this.englishWordService.editWordMeanService(req);
  }
}
