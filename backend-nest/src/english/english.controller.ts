import { Controller, Get } from '@nestjs/common';
import { EnglishService } from './english.service';

@Controller('english')
export class EnglishController {
  constructor(private readonly englishService: EnglishService) {}

  @Get('/partsofspeech')
  async getFileList() {
    return await this.englishService.getPartsofSpeechService();
  }
}
