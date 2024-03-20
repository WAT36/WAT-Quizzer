import { Body, Controller, Get, Post } from '@nestjs/common';
import { EnglishService } from './english.service';
import { AddExampleDto } from '../../interfaces/api/request/english';

@Controller('english')
export class EnglishController {
  constructor(private readonly englishService: EnglishService) {}

  @Get('/partsofspeech')
  async getPosList() {
    return await this.englishService.getPartsofSpeechService();
  }

  @Get('/source')
  async getSourceList() {
    return await this.englishService.getSourceService();
  }

  @Post('/example')
  async addExample(@Body() req: AddExampleDto) {
    return await this.englishService.addExampleService(req);
  }
}
