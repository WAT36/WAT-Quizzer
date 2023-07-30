import { Body, Controller, Get, Post } from '@nestjs/common';
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
}
