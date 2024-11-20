import { Controller, Get } from '@nestjs/common';
import { CategoriesService } from './categories.service';
import { GetCategoriesSwaggerDecorator } from './decorators/swagger.decorator';

@Controller('categories')
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) {}

  @GetCategoriesSwaggerDecorator()
  @Get('')
  async getAllCategories() {
    const categories = await this.categoriesService.getAllCategories();

    return {
      data: categories,
    };
  }
}
