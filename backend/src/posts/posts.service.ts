import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { Prisma } from '@prisma/client';

@Injectable()
export class PostsService {
    constructor(private prisma: PrismaService) { }

    private generateSlug(title: string): string {
        return title
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/^-+|-+$/g, '')
            .concat('-', Date.now().toString(36));
    }

    async create(createPostDto: CreatePostDto, authorId: string) {
        const slug = this.generateSlug(createPostDto.title);

        return this.prisma.post.create({
            data: {
                title: createPostDto.title,
                slug,
                content: createPostDto.content || '',
                excerpt: createPostDto.excerpt,
                coverImage: createPostDto.coverImage,
                seoTitle: createPostDto.seoTitle,
                seoDescription: createPostDto.seoDescription,
                seoKeywords: createPostDto.seoKeywords || [],
                authorId,
                isPublished: false,
            },
            include: {
                author: {
                    select: {
                        id: true,
                        firstName: true,
                        lastName: true,
                        email: true,
                    },
                },
            },
        });
    }

    async findAll(options?: {
        skip?: number;
        take?: number;
        published?: boolean;
        authorId?: string;
    }) {
        const { skip = 0, take = 10, published, authorId } = options || {};

        const where: Prisma.PostWhereInput = {
            deletedAt: null,
        };

        if (published !== undefined) {
            where.isPublished = published;
        }

        if (authorId) {
            where.authorId = authorId;
        }

        const [posts, total] = await Promise.all([
            this.prisma.post.findMany({
                where,
                skip,
                take,
                orderBy: { createdAt: 'desc' },
                include: {
                    author: {
                        select: {
                            id: true,
                            firstName: true,
                            lastName: true,
                            email: true,
                        },
                    },
                    _count: {
                        select: { comments: true },
                    },
                },
            }),
            this.prisma.post.count({ where }),
        ]);

        return {
            data: posts,
            meta: {
                total,
                skip,
                take,
                hasMore: skip + take < total,
            },
        };
    }

    async findOne(id: string) {
        const post = await this.prisma.post.findUnique({
            where: { id },
            include: {
                author: {
                    select: {
                        id: true,
                        firstName: true,
                        lastName: true,
                        email: true,
                        avatarUrl: true,
                    },
                },
                comments: {
                    where: { deletedAt: null, parentId: null },
                    include: {
                        author: {
                            select: {
                                id: true,
                                firstName: true,
                                lastName: true,
                                avatarUrl: true,
                            },
                        },
                        replies: {
                            where: { deletedAt: null },
                            include: {
                                author: {
                                    select: {
                                        id: true,
                                        firstName: true,
                                        lastName: true,
                                        avatarUrl: true,
                                    },
                                },
                            },
                        },
                    },
                    orderBy: { createdAt: 'desc' },
                },
                _count: {
                    select: { comments: true },
                },
            },
        });

        if (!post || post.deletedAt) {
            throw new NotFoundException('Post not found');
        }

        return post;
    }

    async findBySlug(slug: string) {
        const post = await this.prisma.post.findUnique({
            where: { slug },
            include: {
                author: {
                    select: {
                        id: true,
                        firstName: true,
                        lastName: true,
                        email: true,
                        avatarUrl: true,
                    },
                },
                _count: {
                    select: { comments: true },
                },
            },
        });

        if (!post || post.deletedAt) {
            throw new NotFoundException('Post not found');
        }

        return post;
    }

    async update(id: string, updatePostDto: UpdatePostDto, userId: string) {
        const post = await this.prisma.post.findUnique({
            where: { id },
        });

        if (!post || post.deletedAt) {
            throw new NotFoundException('Post not found');
        }

        if (post.authorId !== userId) {
            throw new ForbiddenException('You can only update your own posts');
        }

        return this.prisma.post.update({
            where: { id },
            data: {
                ...updatePostDto,
                updatedAt: new Date(),
            },
            include: {
                author: {
                    select: {
                        id: true,
                        firstName: true,
                        lastName: true,
                        email: true,
                    },
                },
            },
        });
    }

    async publish(id: string, userId: string) {
        const post = await this.prisma.post.findUnique({
            where: { id },
        });

        if (!post || post.deletedAt) {
            throw new NotFoundException('Post not found');
        }

        if (post.authorId !== userId) {
            throw new ForbiddenException('You can only publish your own posts');
        }

        return this.prisma.post.update({
            where: { id },
            data: {
                isPublished: true,
                publishedAt: new Date(),
            },
        });
    }

    async unpublish(id: string, userId: string) {
        const post = await this.prisma.post.findUnique({
            where: { id },
        });

        if (!post || post.deletedAt) {
            throw new NotFoundException('Post not found');
        }

        if (post.authorId !== userId) {
            throw new ForbiddenException('You can only unpublish your own posts');
        }

        return this.prisma.post.update({
            where: { id },
            data: {
                isPublished: false,
                publishedAt: null,
            },
        });
    }

    async remove(id: string, userId: string) {
        const post = await this.prisma.post.findUnique({
            where: { id },
        });

        if (!post || post.deletedAt) {
            throw new NotFoundException('Post not found');
        }

        if (post.authorId !== userId) {
            throw new ForbiddenException('You can only delete your own posts');
        }

        // Soft delete
        return this.prisma.post.update({
            where: { id },
            data: {
                deletedAt: new Date(),
            },
        });
    }
}
