import { Body, Controller, Delete, Get, Post, UseGuards } from '@nestjs/common';
import { QuizFileService } from './file.service';
import { AddQuizFileApiRequest, DeleteQuizFileApiRequest } from 'quizzer-lib';
// import { AuthGuard } from '../../auth/auth.guard';

// @UseGuards(AuthGuard)
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
  async addFile(@Body() req: AddQuizFileApiRequest) {
    return await this.quizFileService.addFile(req);
  }

  @Delete()
  async deleteFile(@Body() req: DeleteQuizFileApiRequest) {
    return await this.quizFileService.deleteFile(req);
  }
}
