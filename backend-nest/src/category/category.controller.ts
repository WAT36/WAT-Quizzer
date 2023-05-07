import { Controller, Delete, Get, Post } from '@nestjs/common';
import { CategoryService } from './category.service';

@Controller('category')
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  @Get()
  getHello(): string {
    return this.categoryService.getHello();
  }
}
