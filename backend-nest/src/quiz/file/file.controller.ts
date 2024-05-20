import { Body, Controller, Delete, Get, Post, UseGuards } from '@nestjs/common';
import { QuizFileService } from './file.service';
import {
  AddQuizFileAPIRequestDto,
  DeleteQuizFileAPIRequestDto,
} from 'quizzer-lib';
import { AuthGuard } from '../../auth/auth.guard';

@UseGuards(AuthGuard)
@Controller('quiz/file')
export class QuizFileController {
  constructor(private readonly quizFileService: QuizFileService) {}

  @Get()
  async getFileList() {
    return await this.quizFileService.getFileList();
  }

  @Get('statistics')
  async getFileStatistics() {
    return await this.quizFileService.getFileStatisticsData();
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
