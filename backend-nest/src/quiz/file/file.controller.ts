import { Body, Controller, Delete, Get, Post } from '@nestjs/common';
import { QuizFileService } from './file.service';
import {
  AddFileDto,
  DeleteFileDto,
} from '../../../interfaces/api/request/quiz';

@Controller('quiz/file')
export class QuizFileController {
  constructor(private readonly quizFileService: QuizFileService) {}

  @Get()
  async getFileList() {
    return await this.quizFileService.getFileList();
  }

  @Post()
  async addFile(@Body() req: AddFileDto) {
    return await this.quizFileService.addFile(req);
  }

  @Delete()
  async deleteFile(@Body() req: DeleteFileDto) {
    return await this.quizFileService.deleteFile(req);
  }
}
