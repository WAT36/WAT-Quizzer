import { Body, Controller, Get, Post, Query, UseGuards } from '@nestjs/common';
import { EnglishService } from './english.service';
import { AddExampleAPIRequestDto } from 'quizzer-lib';
// import { AuthGuard } from '../auth/auth.guard';

// @UseGuards(AuthGuard)
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
  async addExample(@Body() req: AddExampleAPIRequestDto) {
    return await this.englishService.addExampleService(req);
  }

  @Get('/example')
  async searchExample(@Query('query') query: string) {
    return await this.englishService.searchExampleService(query);
  }
}
