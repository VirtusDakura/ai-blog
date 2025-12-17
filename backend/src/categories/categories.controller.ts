import { Controller, Get, Post, Put, Delete, Body, Param, Query, HttpCode, HttpStatus } from '@nestjs/common';
import { CategoriesService } from './categories.service';
import { CreateCategoryDto, UpdateCategoryDto, CreateTagDto } from './dto/category.dto';
import { Public } from '../common/decorators/public.decorator';

@Controller('categories')
export class CategoriesController {
    constructor(private readonly categoriesService: CategoriesService) { }

    // Categories
    @Public()
    @Post()
    @HttpCode(HttpStatus.CREATED)
    async createCategory(@Body() dto: CreateCategoryDto) {
        return this.categoriesService.createCategory(dto);
    }

    @Public()
    @Get()
    async getCategories(@Query('userId') userId: string) {
        if (!userId) return [];
        return this.categoriesService.getCategories(userId);
    }

    @Public()
    @Put(':id')
    async updateCategory(
        @Param('id') id: string,
        @Query('userId') userId: string,
        @Body() dto: UpdateCategoryDto
    ) {
        return this.categoriesService.updateCategory(id, userId, dto);
    }

    @Public()
    @Delete(':id')
    async deleteCategory(@Param('id') id: string, @Query('userId') userId: string) {
        return this.categoriesService.deleteCategory(id, userId);
    }

    // Tags
    @Public()
    @Post('tags')
    @HttpCode(HttpStatus.CREATED)
    async createTag(@Body() dto: CreateTagDto) {
        return this.categoriesService.createTag(dto);
    }

    @Public()
    @Get('tags')
    async getTags(@Query('userId') userId: string) {
        if (!userId) return [];
        return this.categoriesService.getTags(userId);
    }

    @Public()
    @Delete('tags/:id')
    async deleteTag(@Param('id') id: string, @Query('userId') userId: string) {
        return this.categoriesService.deleteTag(id, userId);
    }
}
