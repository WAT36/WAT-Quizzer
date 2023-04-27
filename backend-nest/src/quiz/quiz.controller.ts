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

  @Get('/quiz')
  async getQuiz(file_num: number, quiz_num: number) {
    return await this.quizService.getQuiz(file_num, quiz_num);
  }
}
