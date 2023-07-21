import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { CategoryService } from './category.service';
import { SelectFileDto } from './category.dto';

@Controller('category')
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  @Get()
  async getCategory(@Query('file_num') file_num: number) {
    return await this.categoryService.getCategoryList(file_num);
  }

  @Post()
  async replaceAllCategory(@Body() req: SelectFileDto) {
    return await this.categoryService.replaceAllCategory(req);
  }

  @Get('rate')
  async getAccuracyRateByCategory(@Query('file_num') file_num: number) {
    return await this.categoryService.getAccuracyRateByCategory(file_num);
  }
}
