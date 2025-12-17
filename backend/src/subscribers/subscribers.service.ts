import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateSubscriberDto, CreateCampaignDto } from './dto/subscriber.dto';

@Injectable()
export class SubscribersService {
    constructor(private prisma: PrismaService) { }

    // Subscribers
    async addSubscriber(dto: CreateSubscriberDto) {
        const existing = await this.prisma.subscriber.findUnique({
            where: { userId_email: { userId: dto.userId, email: dto.email } }
        });

        if (existing) {
            if (existing.status === 'UNSUBSCRIBED') {
                // Re-subscribe
                return this.prisma.subscriber.update({
                    where: { id: existing.id },
                    data: { status: 'ACTIVE', unsubscribedAt: null }
                });
            }
            throw new ConflictException('Email is already subscribed');
        }

        return this.prisma.subscriber.create({
            data: {
                email: dto.email,
                name: dto.name,
                userId: dto.userId,
            }
        });
    }

    async getSubscribers(userId: string, status?: string) {
        const where: any = { userId };
        if (status) where.status = status.toUpperCase();

        return this.prisma.subscriber.findMany({
            where,
            orderBy: { createdAt: 'desc' }
        });
    }

    async getSubscriberStats(userId: string) {
        const [total, active, unsubscribed] = await Promise.all([
            this.prisma.subscriber.count({ where: { userId } }),
            this.prisma.subscriber.count({ where: { userId, status: 'ACTIVE' } }),
            this.prisma.subscriber.count({ where: { userId, status: 'UNSUBSCRIBED' } }),
        ]);

        return { total, active, unsubscribed };
    }

    async unsubscribe(userId: string, email: string) {
        const subscriber = await this.prisma.subscriber.findUnique({
            where: { userId_email: { userId, email } }
        });

        if (!subscriber) {
            throw new NotFoundException('Subscriber not found');
        }

        return this.prisma.subscriber.update({
            where: { id: subscriber.id },
            data: { status: 'UNSUBSCRIBED', unsubscribedAt: new Date() }
        });
    }

    async deleteSubscriber(id: string, userId: string) {
        const subscriber = await this.prisma.subscriber.findFirst({
            where: { id, userId }
        });

        if (!subscriber) {
            throw new NotFoundException('Subscriber not found');
        }

        await this.prisma.subscriber.delete({ where: { id } });
        return { success: true };
    }

    // Campaigns
    async createCampaign(dto: CreateCampaignDto) {
        return this.prisma.campaign.create({
            data: {
                subject: dto.subject,
                content: dto.content,
                scheduledAt: dto.scheduledAt ? new Date(dto.scheduledAt) : null,
                userId: dto.userId,
            }
        });
    }

    async getCampaigns(userId: string) {
        return this.prisma.campaign.findMany({
            where: { userId },
            orderBy: { createdAt: 'desc' }
        });
    }

    async getCampaign(id: string, userId: string) {
        const campaign = await this.prisma.campaign.findFirst({
            where: { id, userId }
        });

        if (!campaign) {
            throw new NotFoundException('Campaign not found');
        }

        return campaign;
    }

    async sendCampaign(id: string, userId: string) {
        const campaign = await this.getCampaign(id, userId);

        // Get active subscribers count
        const subscriberCount = await this.prisma.subscriber.count({
            where: { userId, status: 'ACTIVE' }
        });

        // In a real implementation, this would queue emails
        // For now, we just update the status
        return this.prisma.campaign.update({
            where: { id },
            data: {
                status: 'SENT',
                sentAt: new Date(),
                recipients: subscriberCount,
            }
        });
    }

    async deleteCampaign(id: string, userId: string) {
        const campaign = await this.prisma.campaign.findFirst({
            where: { id, userId }
        });

        if (!campaign) {
            throw new NotFoundException('Campaign not found');
        }

        await this.prisma.campaign.delete({ where: { id } });
        return { success: true };
    }

    async getCampaignStats(userId: string) {
        const campaigns = await this.prisma.campaign.findMany({
            where: { userId, status: 'SENT' }
        });

        const totalSent = campaigns.reduce((sum, c) => sum + c.recipients, 0);
        const totalOpened = campaigns.reduce((sum, c) => sum + c.opened, 0);
        const totalClicked = campaigns.reduce((sum, c) => sum + c.clicked, 0);

        return {
            campaignCount: campaigns.length,
            totalSent,
            totalOpened,
            totalClicked,
            avgOpenRate: totalSent > 0 ? Math.round((totalOpened / totalSent) * 100) : 0,
            avgClickRate: totalSent > 0 ? Math.round((totalClicked / totalSent) * 100) : 0,
        };
    }
}
