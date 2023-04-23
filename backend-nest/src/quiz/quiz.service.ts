import { Injectable } from '@nestjs/common';

@Injectable()
export class QuizService {
  getHello(): string {
    return 'Hello World!';
  }
}
