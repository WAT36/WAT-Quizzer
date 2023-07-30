import { Controller } from '@nestjs/common';
import { EnglishService } from './english.service';

@Controller('english')
export class EnglishController {
  constructor(private readonly englishService: EnglishService) {}
}
