import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { EnglishService } from './english.service';
import {
  AddEnglishWordDto,
  AddExampleDto,
  EditWordMeanDto,
} from '../../../interfaces/api/request/english';

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

  @Get('/word/:id')
  async getWordById(@Param('id') id: string) {
    return await this.englishService.getWordByIdService(+id);
  }

  @Patch('/word/:id')
  async editWordMean(@Body() req: EditWordMeanDto) {
    return await this.englishService.editWordMeanService(req);
  }

  @Post('/example')
  async addExample(@Body() req: AddExampleDto) {
    return await this.englishService.addExampleService(req);
  }
}
