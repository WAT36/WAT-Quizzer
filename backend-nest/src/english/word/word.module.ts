import { Module } from '@nestjs/common';
import { EnglishWordController } from './word.controller';
import { EnglishWordService } from './word.service';

@Module({
  imports: [],
  controllers: [EnglishWordController],
  providers: [EnglishWordService],
})
export class EnglishWordModule {}
