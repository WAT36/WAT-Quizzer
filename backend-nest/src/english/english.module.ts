import { Module } from '@nestjs/common';
import { EnglishController } from './english.controller';
import { EnglishService } from './english.service';
import { EnglishWordModule } from './word/word.module';

@Module({
  imports: [EnglishWordModule],
  controllers: [EnglishController],
  providers: [EnglishService],
})
export class EnglishModule {}
