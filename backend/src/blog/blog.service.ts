import { Injectable, ConflictException, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
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
            blogName: blog.name,
            blogDescription: blog.description,
            subdomain: blog.subdomain,
            customDomain: blog.customDomain,
            category: blog.category,
            theme: blog.theme,
            colorScheme: blog.colorScheme,
            displayName: blog.user.displayName,
            bio: blog.user.bio,
            profileImage: blog.user.avatarUrl,
            timezone: blog.user.timezone,
            language: blog.user.language,
            hasCompletedOnboarding: blog.user.onboardingCompleted,
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
}
