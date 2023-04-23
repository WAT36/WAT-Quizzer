import { Controller, Get } from '@nestjs/common';
import { QuizService } from './quiz.service';

@Controller('quiz')
export class QuizController {
  constructor(private readonly quizService: QuizService) {}

  @Get()
  getHello(): string {
    return this.quizService.getHello();
  }

  @Get('/file')
  async getFileList() {
    return await this.quizService.getFileList();
  }
}
