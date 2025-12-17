import { Controller, Get, Post, Put, Delete, Body, Param, Query, HttpCode, HttpStatus } from '@nestjs/common';
import { PagesService } from './pages.service';
import { CreatePageDto, UpdatePageDto } from './dto/page.dto';
import { Public } from '../common/decorators/public.decorator';

@Controller('pages')
export class PagesController {
    constructor(private readonly pagesService: PagesService) { }

    @Post()
    @HttpCode(HttpStatus.CREATED)
    async createPage(@Body() dto: CreatePageDto) {
        return this.pagesService.createPage(dto);
    }

    @Get()
    async getPages(@Query('userId') userId: string) {
        if (!userId) return [];
        return this.pagesService.getPages(userId);
    }

    @Get(':id')
    async getPage(@Param('id') id: string, @Query('userId') userId: string) {
        return this.pagesService.getPage(id, userId);
    }

    @Public()
    @Get('by-slug/:slug')
    async getPageBySlug(@Param('slug') slug: string, @Query('userId') userId: string) {
        return this.pagesService.getPageBySlug(userId, slug);
    }

    @Put(':id')
    async updatePage(
        @Param('id') id: string,
        @Query('userId') userId: string,
        @Body() dto: UpdatePageDto
    ) {
        return this.pagesService.updatePage(id, userId, dto);
    }

    @Delete(':id')
    async deletePage(@Param('id') id: string, @Query('userId') userId: string) {
        return this.pagesService.deletePage(id, userId);
    }

    @Post('reorder')
    async reorderPages(@Body() body: { userId: string; orders: { id: string; order: number }[] }) {
        return this.pagesService.reorderPages(body.userId, body.orders);
    }
}
