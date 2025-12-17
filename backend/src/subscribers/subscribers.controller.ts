import { Controller, Get, Post, Delete, Body, Param, Query, HttpCode, HttpStatus } from '@nestjs/common';
import { SubscribersService } from './subscribers.service';
import { CreateSubscriberDto, CreateCampaignDto } from './dto/subscriber.dto';
import { Public } from '../common/decorators/public.decorator';

@Controller('subscribers')
export class SubscribersController {
    constructor(private readonly subscribersService: SubscribersService) { }

    // Subscribers
    @Public()
    @Post()
    @HttpCode(HttpStatus.CREATED)
    async addSubscriber(@Body() dto: CreateSubscriberDto) {
        return this.subscribersService.addSubscriber(dto);
    }

    @Get()
    async getSubscribers(@Query('userId') userId: string, @Query('status') status?: string) {
        if (!userId) return [];
        return this.subscribersService.getSubscribers(userId, status);
    }

    @Get('stats')
    async getSubscriberStats(@Query('userId') userId: string) {
        if (!userId) return { total: 0, active: 0, unsubscribed: 0 };
        return this.subscribersService.getSubscriberStats(userId);
    }

    @Public()
    @Post('unsubscribe')
    async unsubscribe(@Body() body: { userId: string; email: string }) {
        return this.subscribersService.unsubscribe(body.userId, body.email);
    }

    @Delete(':id')
    async deleteSubscriber(@Param('id') id: string, @Query('userId') userId: string) {
        return this.subscribersService.deleteSubscriber(id, userId);
    }

    // Campaigns
    @Post('campaigns')
    @HttpCode(HttpStatus.CREATED)
    async createCampaign(@Body() dto: CreateCampaignDto) {
        return this.subscribersService.createCampaign(dto);
    }

    @Get('campaigns')
    async getCampaigns(@Query('userId') userId: string) {
        if (!userId) return [];
        return this.subscribersService.getCampaigns(userId);
    }

    @Get('campaigns/stats')
    async getCampaignStats(@Query('userId') userId: string) {
        if (!userId) return { campaignCount: 0, totalSent: 0, totalOpened: 0, totalClicked: 0 };
        return this.subscribersService.getCampaignStats(userId);
    }

    @Get('campaigns/:id')
    async getCampaign(@Param('id') id: string, @Query('userId') userId: string) {
        return this.subscribersService.getCampaign(id, userId);
    }

    @Post('campaigns/:id/send')
    async sendCampaign(@Param('id') id: string, @Query('userId') userId: string) {
        return this.subscribersService.sendCampaign(id, userId);
    }

    @Delete('campaigns/:id')
    async deleteCampaign(@Param('id') id: string, @Query('userId') userId: string) {
        return this.subscribersService.deleteCampaign(id, userId);
    }
}
