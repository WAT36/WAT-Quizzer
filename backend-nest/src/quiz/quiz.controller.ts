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

  @Get('')
  async getQuiz(file_num: number, quiz_num: number) {
    return await this.quizService.getQuiz(file_num, quiz_num);
  }

  @Get('/random')
  async getRandomQuiz(
    file_num: number,
    min_rate: number,
    max_rate: number,
    category: string,
    checked: boolean,
  ) {
    return await this.quizService.getRandomQuiz(
      file_num,
      min_rate,
      max_rate,
      category,
      checked,
    );
  }

  @Get('/worst')
  async getWorstRateQuiz(file_num: number, category: string, checked: boolean) {
    return await this.quizService.getWorstRateQuiz(file_num, category, checked);
  }

  @Get('/minimum')
  async getMinimumAnsweredQuiz(
    file_num: number,
    category: string,
    checked: boolean,
  ) {
    return await this.quizService.getMinimumAnsweredQuiz(
      file_num,
      category,
      checked,
    );
  }
}
