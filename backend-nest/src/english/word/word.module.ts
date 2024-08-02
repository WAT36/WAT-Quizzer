import { Module } from '@nestjs/common';
import { EnglishWordController } from './word.controller';
import { EnglishWordService } from './word.service';
import { EnglishWordTestService } from './test/test.service';

@Module({
  imports: [],
  controllers: [EnglishWordController],
  providers: [EnglishWordService, EnglishWordTestService],
})
export class EnglishWordModule {}
