import { Injectable } from '@nestjs/common';
import { SQL } from 'config/sql';
import { execQuery } from 'lib/db/dao';

@Injectable()
export class CategoryService {
  getHello(): string {
    return 'Hello World!';
  }
}
