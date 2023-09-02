import { Controller } from '@nestjs/common';
import { SayingService } from './saying.service';

@Controller('saying')
export class SayingController {
  constructor(private readonly sayingService: SayingService) {}

  // @Get()
  // async getCategory(@Query('file_num') file_num: number) {
  //   return await this.categoryService.getCategoryList(file_num);
  // }

  // @Post()
  // async replaceAllCategory(@Body() req: SelectFileDto) {
  //   return await this.categoryService.replaceAllCategory(req);
  // }

  // @Get('rate')
  // async getAccuracyRateByCategory(@Query('file_num') file_num: number) {
  //   return await this.categoryService.getAccuracyRateByCategory(file_num);
  // }
}
