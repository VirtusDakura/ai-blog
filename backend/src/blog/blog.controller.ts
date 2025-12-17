import { Controller, Post, Put, Get, Body, Param, Query, HttpCode, HttpStatus } from '@nestjs/common';
import { BlogService } from './blog.service';
import { BlogSetupDto } from './dto/blog-setup.dto';
import { Public } from '../common/decorators/public.decorator';

@Controller('blog')
export class BlogController {
    constructor(private readonly blogService: BlogService) { }

    @Post('setup')
    @HttpCode(HttpStatus.OK)
    async setupBlog(@Body() blogSetupDto: BlogSetupDto) {
        // userId is now a required field in the DTO
        return this.blogService.setupBlog(blogSetupDto.userId, blogSetupDto);
    }

    @Get('settings')
    async getBlogSettings(@Query('userId') userId: string) {
        if (!userId) {
            return {
                blogName: null,
                subdomain: null,
                hasCompletedOnboarding: false,
            };
        }
        return this.blogService.getBlogSettings(userId);
    }

    @Put('settings')
    async updateBlogSettings(@Body() body: { userId: string; settings: any }) {
        return this.blogService.updateBlogSettings(body.userId, body.settings);
    }

    @Get('status')
    async getBlogStatus(@Query('userId') userId: string) {
        if (!userId) {
            return {
                hasCompletedOnboarding: false,
                subdomain: null,
                blogName: null,
            };
        }
        return this.blogService.getBlogStatus(userId);
    }

    @Public()
    @Get('check-subdomain')
    async checkSubdomain(@Query('subdomain') subdomain: string, @Query('userId') userId?: string) {
        return this.blogService.checkSubdomainAvailability(subdomain, userId);
    }

    // Donations endpoints
    @Get('donations')
    async getDonations(@Query('userId') userId: string) {
        if (!userId) return { donations: [], total: 0, count: 0 };
        return this.blogService.getDonations(userId);
    }

    @Public()
    @Post('donations')
    @HttpCode(HttpStatus.CREATED)
    async createDonation(@Body() body: {
        userId: string;
        amount: number;
        message?: string;
        donorName?: string;
        donorEmail?: string;
    }) {
        return this.blogService.createDonation(body.userId, body);
    }

    // Integrations endpoints
    @Get('integrations/:blogId')
    async getIntegrations(@Param('blogId') blogId: string) {
        return this.blogService.getIntegrations(blogId);
    }

    @Put('integrations/:blogId/:name')
    async updateIntegration(
        @Param('blogId') blogId: string,
        @Param('name') name: string,
        @Body() body: { enabled?: boolean; settings?: string }
    ) {
        return this.blogService.updateIntegration(blogId, name, body);
    }

    @Public()
    @Get(':subdomain')
    async getBlogBySubdomain(@Param('subdomain') subdomain: string) {
        return this.blogService.getBlogBySubdomain(subdomain);
    }
}
