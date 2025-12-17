import { Controller, Post, Get, Body, Param, Query, Req, HttpCode, HttpStatus } from '@nestjs/common';
import { BlogService } from './blog.service';
import { BlogSetupDto } from './dto/blog-setup.dto';
import { Public } from '../common/decorators/public.decorator';

@Controller('blog')
export class BlogController {
    constructor(private readonly blogService: BlogService) { }

    @Post('setup')
    @HttpCode(HttpStatus.OK)
    async setupBlog(@Req() req: any, @Body() blogSetupDto: BlogSetupDto) {
        // In production, get userId from authenticated user
        // For now, we'll get it from request (set by auth middleware)
        const userId = req.user?.id || req.body.userId;
        return this.blogService.setupBlog(userId, blogSetupDto);
    }

    @Get('settings')
    async getBlogSettings(@Req() req: any) {
        const userId = req.user?.id;
        return this.blogService.getBlogSettings(userId);
    }

    @Get('status')
    async getBlogStatus(@Req() req: any) {
        const userId = req.user?.id;
        return this.blogService.getBlogStatus(userId);
    }

    @Public()
    @Get('check-subdomain')
    async checkSubdomain(@Query('subdomain') subdomain: string, @Req() req: any) {
        const userId = req.user?.id;
        return this.blogService.checkSubdomainAvailability(subdomain, userId);
    }

    @Public()
    @Get(':subdomain')
    async getBlogBySubdomain(@Param('subdomain') subdomain: string) {
        return this.blogService.getBlogBySubdomain(subdomain);
    }
}
