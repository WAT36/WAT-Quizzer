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
import { EnglishService } from './english.service';
import {
  AddEnglishWordDto,
  AddExampleDto,
  AddWordSubSourceDto,
  AddWordTestLogDto,
  EditWordMeanDto,
  EditWordSourceDto,
  GetWordSubSourceDto,
} from '../../interfaces/api/request/english';

@Controller('english')
export class EnglishController {
  constructor(private readonly englishService: EnglishService) {}

  @Get('/partsofspeech')
  async getPosList() {
    return await this.englishService.getPartsofSpeechService();
  }

  @Post('/word/add')
  async addWord(@Body() req: AddEnglishWordDto) {
    return await this.englishService.addWordAndMeanService(req);
  }

  @Get('/word/search')
  async searchWord(@Query('wordName') wordName: string) {
    return await this.englishService.searchWordService(wordName);
  }

  @Get('/word')
  async getAllWord() {
    return await this.englishService.getAllWordService();
  }

  @Get('/word/byname')
  async getWordByName(@Query('name') name: string) {
    return await this.englishService.getWordByNameService(name);
  }

  @Get('/source')
  async getSourceList() {
    return await this.englishService.getSourceService();
  }

  @Get('/word/random')
  async getRandomWord(@Query('sourceId') sourceId: number) {
    return await this.englishService.getRandomWordService(+sourceId);
  }

  // 指定した単語を出題するときの四択選択肢（正解選択肢1つとダミー選択肢3つ）を作る
  @Get('/word/fourchoice')
  async makeFourChoice(@Query('wordId') wordId: number) {
    return await this.englishService.makeFourChoiceService(+wordId);
  }

  @Post('/word/test/clear')
  async wordTestCleared(@Body() req: AddWordTestLogDto) {
    return await this.englishService.wordTestClearedService(req);
  }

  @Post('/word/test/fail')
  async wordTestFailed(@Body() req: AddWordTestLogDto) {
    return await this.englishService.wordTestFailedService(req);
  }

  @Post('/example')
  async addExample(@Body() req: AddExampleDto) {
    return await this.englishService.addExampleService(req);
  }

  @Put('/word/source')
  async editSourceOfWordById(@Body() req: EditWordSourceDto) {
    return await this.englishService.editSourceOfWordById(req);
  }

  @Put('/word/subsource')
  async editSubSourceOfWordById(@Body() req: AddWordSubSourceDto) {
    return await this.englishService.addSubSourceOfWordById(req);
  }

  @Get('/word/subsource')
  async getSubSourceOfWordById(@Body() req: GetWordSubSourceDto) {
    return await this.englishService.getSubSourceOfWordById(req);
  }

  /* 注 以下APIは一番最後に置くこと パスが上書きされて全てこのAPIが使われてしまうため */
  @Get('/word/source/:id')
  async getSourceOfWordById(@Param('id') id: string) {
    return await this.englishService.getSourceOfWordById(+id);
  }

  @Get('/word/:id')
  async getWordById(@Param('id') id: string) {
    return await this.englishService.getWordByIdService(+id);
  }

  @Patch('/word/:id')
  async editWordMean(@Body() req: EditWordMeanDto) {
    return await this.englishService.editWordMeanService(req);
  }
}
