import { Injectable, ConflictException, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { BlogSetupDto } from './dto/blog-setup.dto';

@Injectable()
export class BlogService {
    constructor(private prisma: PrismaService) { }

    async setupBlog(userId: string, dto: BlogSetupDto) {
        // Check if subdomain is already taken
        const existingBlog = await this.prisma.blog.findUnique({
            where: { subdomain: dto.subdomain },
        });

        if (existingBlog && existingBlog.userId !== userId) {
            throw new ConflictException('This subdomain is already taken');
        }

        // Check if user already has a blog
        const userBlog = await this.prisma.blog.findUnique({
            where: { userId },
        });

        // Update or create blog and user profile in a transaction
        const result = await this.prisma.$transaction(async (tx) => {
            // Update user profile fields
            const user = await tx.user.update({
                where: { id: userId },
                data: {
                    displayName: dto.displayName,
                    bio: dto.bio,
                    avatarUrl: dto.profileImage,
                    timezone: dto.timezone,
                    language: dto.language,
                    onboardingCompleted: dto.onboardingCompleted ?? true,
                },
            });

            // Create or update blog
            let blog;
            if (userBlog) {
                blog = await tx.blog.update({
                    where: { userId },
                    data: {
                        name: dto.blogName,
                        description: dto.blogDescription,
                        subdomain: dto.subdomain,
                        customDomain: dto.useCustomDomain ? dto.customDomain : null,
                        category: dto.category,
                        theme: dto.theme || 'minimal',
                        colorScheme: dto.colorScheme || 'violet',
                    },
                });
            } else {
                blog = await tx.blog.create({
                    data: {
                        name: dto.blogName,
                        description: dto.blogDescription,
                        subdomain: dto.subdomain,
                        customDomain: dto.useCustomDomain ? dto.customDomain : null,
                        category: dto.category,
                        theme: dto.theme || 'minimal',
                        colorScheme: dto.colorScheme || 'violet',
                        userId,
                    },
                });
            }

            return { user, blog };
        });

        return {
            message: 'Blog setup completed successfully',
            blog: result.blog,
            user: {
                id: result.user.id,
                displayName: result.user.displayName,
                onboardingCompleted: result.user.onboardingCompleted,
            },
        };
    }

    async getBlogSettings(userId: string) {
        const blog = await this.prisma.blog.findUnique({
            where: { userId },
            include: {
                user: {
                    select: {
                        displayName: true,
                        bio: true,
                        avatarUrl: true,
                        timezone: true,
                        language: true,
                        email: true,
                        onboardingCompleted: true,
                    },
                },
            },
        });

        if (!blog) {
            return {
                blogName: null,
                subdomain: null,
                hasCompletedOnboarding: false,
            };
        }

        return {
            // Basic info
            blogName: blog.name,
            blogDescription: blog.description,
            subdomain: blog.subdomain,
            customDomain: blog.customDomain,
            category: blog.category,

            // Appearance
            theme: blog.theme,
            colorScheme: blog.colorScheme,
            font: blog.font,
            layout: blog.layout,
            darkMode: blog.darkMode,
            logoUrl: blog.logoUrl,
            faviconUrl: blog.faviconUrl,
            customCss: blog.customCss,

            // User profile
            displayName: blog.user.displayName,
            bio: blog.user.bio,
            profileImage: blog.user.avatarUrl,
            email: blog.user.email,
            timezone: blog.user.timezone,
            language: blog.user.language,
            hasCompletedOnboarding: blog.user.onboardingCompleted,

            // Privacy settings
            isPublic: blog.isPublic,
            allowComments: blog.allowComments,
            moderateComments: blog.moderateComments,
            showAuthorBio: blog.showAuthorBio,
            enableRss: blog.enableRss,
            allowIndexing: blog.allowIndexing,

            // SEO settings
            seoTitle: blog.seoTitle,
            seoDescription: blog.seoDescription,
            seoKeywords: blog.seoKeywords,
            ogImage: blog.ogImage,
            twitterHandle: blog.twitterHandle,
            facebookPage: blog.facebookPage,
            enableSitemap: blog.enableSitemap,
            enableJsonLd: blog.enableJsonLd,
            canonicalUrl: blog.canonicalUrl,

            // Notification settings
            emailOnComment: blog.emailOnComment,
            emailOnSubscriber: blog.emailOnSubscriber,
            emailDigest: blog.emailDigest,

            // Monetization
            donationsEnabled: blog.donationsEnabled,
            donationMessage: blog.donationMessage,
            stripeConnected: blog.stripeConnected,
            paypalEmail: blog.paypalEmail,
            minimumPayout: blog.minimumPayout,

            // Ads
            adsEnabled: blog.adsEnabled,
            adsProvider: blog.adsProvider,
            adsPublisherId: blog.adsPublisherId,
            autoAds: blog.autoAds,

            // Analytics
            analyticsId: blog.analyticsId,
        };
    }

    async updateBlogSettings(userId: string, settings: Partial<{
        // General
        blogName: string;
        blogDescription: string;
        subdomain: string;
        customDomain: string;
        category: string;

        // Appearance
        theme: string;
        colorScheme: string;
        font: string;
        layout: string;
        darkMode: string;
        logoUrl: string;
        faviconUrl: string;
        customCss: string;
        headerCode: string;
        footerCode: string;

        // Privacy
        isPublic: boolean;
        allowComments: boolean;
        moderateComments: boolean;
        showAuthorBio: boolean;
        enableRss: boolean;
        allowIndexing: boolean;

        // SEO
        seoTitle: string;
        seoDescription: string;
        seoKeywords: string;
        ogImage: string;
        twitterHandle: string;
        facebookPage: string;
        enableSitemap: boolean;
        enableJsonLd: boolean;
        canonicalUrl: string;

        // Notifications
        emailOnComment: boolean;
        emailOnSubscriber: boolean;
        emailDigest: string;

        // Monetization
        donationsEnabled: boolean;
        donationMessage: string;
        suggestedAmounts: string;
        paypalEmail: string;
        minimumPayout: number;

        // Ads
        adsEnabled: boolean;
        adsProvider: string;
        adsPublisherId: string;
        autoAds: boolean;
        adsTxt: string;
        adPlacements: string;

        // Analytics
        analyticsId: string;
    }>) {
        const blog = await this.prisma.blog.findUnique({
            where: { userId },
        });

        if (!blog) {
            throw new NotFoundException('Blog not found');
        }

        // If subdomain is being changed, check availability
        if (settings.subdomain && settings.subdomain !== blog.subdomain) {
            const existing = await this.prisma.blog.findUnique({
                where: { subdomain: settings.subdomain },
            });
            if (existing) {
                throw new ConflictException('This subdomain is already taken');
            }
        }

        const updateData: any = {};

        // Map settings to database fields
        if (settings.blogName !== undefined) updateData.name = settings.blogName;
        if (settings.blogDescription !== undefined) updateData.description = settings.blogDescription;
        if (settings.subdomain !== undefined) updateData.subdomain = settings.subdomain;
        if (settings.customDomain !== undefined) updateData.customDomain = settings.customDomain;
        if (settings.category !== undefined) updateData.category = settings.category;

        // Appearance
        if (settings.theme !== undefined) updateData.theme = settings.theme;
        if (settings.colorScheme !== undefined) updateData.colorScheme = settings.colorScheme;
        if (settings.font !== undefined) updateData.font = settings.font;
        if (settings.layout !== undefined) updateData.layout = settings.layout;
        if (settings.darkMode !== undefined) updateData.darkMode = settings.darkMode;
        if (settings.logoUrl !== undefined) updateData.logoUrl = settings.logoUrl;
        if (settings.faviconUrl !== undefined) updateData.faviconUrl = settings.faviconUrl;
        if (settings.customCss !== undefined) updateData.customCss = settings.customCss;
        if (settings.headerCode !== undefined) updateData.headerCode = settings.headerCode;
        if (settings.footerCode !== undefined) updateData.footerCode = settings.footerCode;

        // Privacy
        if (settings.isPublic !== undefined) updateData.isPublic = settings.isPublic;
        if (settings.allowComments !== undefined) updateData.allowComments = settings.allowComments;
        if (settings.moderateComments !== undefined) updateData.moderateComments = settings.moderateComments;
        if (settings.showAuthorBio !== undefined) updateData.showAuthorBio = settings.showAuthorBio;
        if (settings.enableRss !== undefined) updateData.enableRss = settings.enableRss;
        if (settings.allowIndexing !== undefined) updateData.allowIndexing = settings.allowIndexing;

        // SEO
        if (settings.seoTitle !== undefined) updateData.seoTitle = settings.seoTitle;
        if (settings.seoDescription !== undefined) updateData.seoDescription = settings.seoDescription;
        if (settings.seoKeywords !== undefined) updateData.seoKeywords = settings.seoKeywords;
        if (settings.ogImage !== undefined) updateData.ogImage = settings.ogImage;
        if (settings.twitterHandle !== undefined) updateData.twitterHandle = settings.twitterHandle;
        if (settings.facebookPage !== undefined) updateData.facebookPage = settings.facebookPage;
        if (settings.enableSitemap !== undefined) updateData.enableSitemap = settings.enableSitemap;
        if (settings.enableJsonLd !== undefined) updateData.enableJsonLd = settings.enableJsonLd;
        if (settings.canonicalUrl !== undefined) updateData.canonicalUrl = settings.canonicalUrl;

        // Notifications
        if (settings.emailOnComment !== undefined) updateData.emailOnComment = settings.emailOnComment;
        if (settings.emailOnSubscriber !== undefined) updateData.emailOnSubscriber = settings.emailOnSubscriber;
        if (settings.emailDigest !== undefined) updateData.emailDigest = settings.emailDigest;

        // Monetization
        if (settings.donationsEnabled !== undefined) updateData.donationsEnabled = settings.donationsEnabled;
        if (settings.donationMessage !== undefined) updateData.donationMessage = settings.donationMessage;
        if (settings.suggestedAmounts !== undefined) updateData.suggestedAmounts = settings.suggestedAmounts;
        if (settings.paypalEmail !== undefined) updateData.paypalEmail = settings.paypalEmail;
        if (settings.minimumPayout !== undefined) updateData.minimumPayout = settings.minimumPayout;

        // Ads
        if (settings.adsEnabled !== undefined) updateData.adsEnabled = settings.adsEnabled;
        if (settings.adsProvider !== undefined) updateData.adsProvider = settings.adsProvider;
        if (settings.adsPublisherId !== undefined) updateData.adsPublisherId = settings.adsPublisherId;
        if (settings.autoAds !== undefined) updateData.autoAds = settings.autoAds;
        if (settings.adsTxt !== undefined) updateData.adsTxt = settings.adsTxt;
        if (settings.adPlacements !== undefined) updateData.adPlacements = settings.adPlacements;

        // Analytics
        if (settings.analyticsId !== undefined) updateData.analyticsId = settings.analyticsId;

        const updatedBlog = await this.prisma.blog.update({
            where: { userId },
            data: updateData,
        });

        return {
            message: 'Settings updated successfully',
            blog: updatedBlog,
        };
    }

    async getBlogStatus(userId: string) {
        const user = await this.prisma.user.findUnique({
            where: { id: userId },
            select: {
                onboardingCompleted: true,
                blog: {
                    select: {
                        subdomain: true,
                        name: true,
                    },
                },
            },
        });

        if (!user) {
            throw new NotFoundException('User not found');
        }

        return {
            hasCompletedOnboarding: user.onboardingCompleted,
            subdomain: user.blog?.subdomain,
            blogName: user.blog?.name,
        };
    }

    async checkSubdomainAvailability(subdomain: string, userId?: string) {
        const existingBlog = await this.prisma.blog.findUnique({
            where: { subdomain },
        });

        // Available if no blog exists with this subdomain
        // OR if the existing blog belongs to the current user
        const isAvailable = !existingBlog || (userId && existingBlog.userId === userId);

        return {
            subdomain,
            available: isAvailable,
        };
    }

    async getBlogBySubdomain(subdomain: string) {
        const blog = await this.prisma.blog.findUnique({
            where: { subdomain },
            include: {
                user: {
                    select: {
                        displayName: true,
                        bio: true,
                        avatarUrl: true,
                    },
                },
            },
        });

        if (!blog) {
            throw new NotFoundException('Blog not found');
        }

        return blog;
    }

    // Get donations for a blog owner
    async getDonations(userId: string) {
        const donations = await this.prisma.donation.findMany({
            where: { userId },
            orderBy: { createdAt: 'desc' },
        });

        const stats = await this.prisma.donation.aggregate({
            where: { userId },
            _sum: { amount: true },
            _count: true,
        });

        return {
            donations,
            total: stats._sum.amount || 0,
            count: stats._count,
        };
    }

    // Create a donation
    async createDonation(userId: string, data: {
        amount: number;
        message?: string;
        donorName?: string;
        donorEmail?: string;
        stripePaymentId?: string;
        paypalPaymentId?: string;
    }) {
        return this.prisma.donation.create({
            data: {
                ...data,
                userId,
            },
        });
    }

    // Get integrations for a blog
    async getIntegrations(blogId: string) {
        return this.prisma.integration.findMany({
            where: { blogId },
        });
    }

    // Update an integration
    async updateIntegration(blogId: string, name: string, settings: { enabled?: boolean; settings?: string }) {
        const existing = await this.prisma.integration.findUnique({
            where: { blogId_name: { blogId, name } },
        });

        if (existing) {
            return this.prisma.integration.update({
                where: { id: existing.id },
                data: settings,
            });
        }

        return this.prisma.integration.create({
            data: {
                blogId,
                name,
                enabled: settings.enabled ?? false,
                settings: settings.settings,
            },
        });
    }
}
