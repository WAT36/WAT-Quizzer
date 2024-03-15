import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Put,
  Query,
} from '@nestjs/common';
import { EnglishWordService } from './word.service';
import { AddEnglishWordAPIRequestDto, AddWordTestResultLogAPIRequestDto, EditWordSourceAPIRequestDto, AddWordSubSourceAPIRequestDto, EditWordMeanAPIRequestDto } from 'quizzer-lib';

@Controller('english/word')
export class EnglishWordController {
  constructor(private readonly englishWordService: EnglishWordService) {}

  @Post('add')
  async addWord(@Body() req: AddEnglishWordAPIRequestDto) {
    return await this.englishWordService.addWordAndMeanService(req);
  }

  @Get('search')
  async searchWord(
    @Query('wordName') wordName: string,
    @Query('subSourceName') subSourceName: string,
  ) {
    return await this.englishWordService.searchWordService(
      wordName,
      subSourceName,
    );
  }

  @Get()
  async getAllWord() {
    return await this.englishWordService.getAllWordService();
  }

  @Get('byname')
  async getWordByName(@Query('name') name: string) {
    return await this.englishWordService.getWordByNameService(name);
  }

  @Get('random')
  async getRandomWord(
    @Query('source') source: string,
    @Query('startDate') startDate: string,
    @Query('endDate') endDate: string,
  ) {
    return await this.englishWordService.getRandomWordService(
      source,
      startDate,
      endDate,
    );
  }

  // 指定した単語を出題するときの四択選択肢（正解選択肢1つとダミー選択肢3つ）を作る
  @Get('fourchoice')
  async makeFourChoice(@Query('wordId') wordId: number) {
    return await this.englishWordService.makeFourChoiceService(+wordId);
  }

  @Post('test/clear')
  async wordTestCleared(@Body() req: AddWordTestResultLogAPIRequestDto) {
    return await this.englishWordService.wordTestClearedService(req);
  }

  @Post('test/fail')
  async wordTestFailed(@Body() req: AddWordTestResultLogAPIRequestDto) {
    return await this.englishWordService.wordTestFailedService(req);
  }

  @Put('source')
  async editSourceOfWordById(@Body() req: EditWordSourceAPIRequestDto) {
    return await this.englishWordService.editSourceOfWordById(req);
  }

  @Put('subsource')
  async addSubSourceOfWordById(@Body() req: AddWordSubSourceAPIRequestDto) {
    return await this.englishWordService.addSubSourceOfWordById(req);
  }

  @Get('summary')
  async getSummary() {
    return await this.englishWordService.getSummary();
  }

  /* 注 以下APIは一番最後に置くこと パスが上書きされて全てこのAPIが使われてしまうため */
  @Get('source/:id')
  async getSourceOfWordById(@Param('id') id: string) {
    return await this.englishWordService.getSourceOfWordById(+id);
  }

  @Get('subsource/:id')
  async getSubSourceOfWordById(@Param('id') id: string) {
    return await this.englishWordService.getSubSourceOfWordById(+id);
  }

  @Get(':id')
  async getWordById(@Param('id') id: string) {
    return await this.englishWordService.getWordByIdService(+id);
  }

  @Patch(':id')
  async editWordMean(@Body() req: EditWordMeanAPIRequestDto) {
    return await this.englishWordService.editWordMeanService(req);
  }
}
