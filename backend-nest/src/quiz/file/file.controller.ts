import { Body, Controller, Delete, Get, Post } from '@nestjs/common';
import { QuizFileService } from './file.service';
import {
  AddQuizFileAPIRequestDto,
  DeleteQuizFileAPIRequestDto,
} from 'quizzer-lib';

@Controller('quiz/file')
export class QuizFileController {
  constructor(private readonly quizFileService: QuizFileService) {}

  @Get()
  async getFileList() {
    return await this.quizFileService.getFileList();
  }

  @Post()
  async addFile(@Body() req: AddQuizFileAPIRequestDto) {
    return await this.quizFileService.addFile(req);
  }

  @Delete()
  async deleteFile(@Body() req: DeleteQuizFileAPIRequestDto) {
    return await this.quizFileService.deleteFile(req);
  }
}
