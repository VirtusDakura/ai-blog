import { Controller, Get, Post, Put, Delete, Body, Param, Query, HttpCode, HttpStatus } from '@nestjs/common';
import { PagesService } from './pages.service';
import { CreatePageDto, UpdatePageDto } from './dto/page.dto';
import { Public } from '../common/decorators/public.decorator';

@Controller('pages')
export class PagesController {
    constructor(private readonly pagesService: PagesService) { }

    @Public()
    @Post()
    @HttpCode(HttpStatus.CREATED)
    async createPage(@Body() dto: CreatePageDto) {
        return this.pagesService.createPage(dto);
    }

    @Public()
    @Get()
    async getPages(@Query('userId') userId: string) {
        if (!userId) return [];
        return this.pagesService.getPages(userId);
    }

    @Public()
    @Get(':id')
    async getPage(@Param('id') id: string, @Query('userId') userId: string) {
        return this.pagesService.getPage(id, userId);
    }

    @Public()
    @Get('by-slug/:slug')
    async getPageBySlug(@Param('slug') slug: string, @Query('userId') userId: string) {
        return this.pagesService.getPageBySlug(userId, slug);
    }

    @Public()
    @Put(':id')
    async updatePage(
        @Param('id') id: string,
        @Query('userId') userId: string,
        @Body() dto: UpdatePageDto
    ) {
        return this.pagesService.updatePage(id, userId, dto);
    }

    @Public()
    @Delete(':id')
    async deletePage(@Param('id') id: string, @Query('userId') userId: string) {
        return this.pagesService.deletePage(id, userId);
    }

    @Public()
    @Post('reorder')
    async reorderPages(@Body() body: { userId: string; orders: { id: string; order: number }[] }) {
        return this.pagesService.reorderPages(body.userId, body.orders);
    }
}
