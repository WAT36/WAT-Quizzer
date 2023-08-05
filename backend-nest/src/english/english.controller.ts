import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { EnglishService } from './english.service';
import { AddEnglishWordDto } from './english.dto';

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

  @Get('/source')
  async getSourceList() {
    return await this.englishService.getSourceService();
  }
}
