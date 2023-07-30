import { Injectable } from '@nestjs/common';

@Injectable()
export class EnglishService {
  getHello(): string {
    return 'Hello World!';
  }
}
