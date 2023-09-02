import { Module } from '@nestjs/common';
import { SayingService } from './saying.service';
import { SayingController } from './saying.controller';

@Module({
  imports: [],
  controllers: [SayingController],
  providers: [SayingService],
})
export class SayingModule {}
