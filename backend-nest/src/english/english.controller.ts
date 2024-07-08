import { Body, Controller, Get, Post, Query, UseGuards } from '@nestjs/common';
import { EnglishService } from './english.service';
import {
  AddExampleAPIRequestDto,
  ChangeAssociationOfExampleRequestDto,
} from 'quizzer-lib';
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

  // TODO isLinkedはNestのPipeを使ってbooleanで受け取るようにしたい。
  @Get('/example')
  async searchExample(
    @Query('query') query: string,
    @Query('isLinked') isLinked: string,
  ) {
    return await this.englishService.searchExampleService(query, isLinked);
  }

  @Post('/example/association')
  async changeAssociationOfExample(
    @Body() req: ChangeAssociationOfExampleRequestDto,
  ) {
    return await this.englishService.changeAssociationOfExampleService(req);
  }
}
