import { Module } from '@nestjs/common';
import { EnglishController } from './english.controller';
import { EnglishService } from './english.service';

@Module({
  imports: [],
  controllers: [EnglishController],
  providers: [EnglishService],
})
export class EnglishModule {}
