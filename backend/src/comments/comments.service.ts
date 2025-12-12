import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';
import { Prisma } from '@prisma/client';

@Injectable()
export class CommentsService {
    constructor(private prisma: PrismaService) { }

    async create(createCommentDto: CreateCommentDto, authorId: string) {
        // Verify post exists
        const post = await this.prisma.post.findUnique({
            where: { id: createCommentDto.postId },
        });

        if (!post || post.deletedAt) {
            throw new NotFoundException('Post not found');
        }

        // Verify parent comment exists if provided
        if (createCommentDto.parentId) {
            const parentComment = await this.prisma.comment.findUnique({
                where: { id: createCommentDto.parentId },
            });

            if (!parentComment || parentComment.deletedAt) {
                throw new NotFoundException('Parent comment not found');
            }

            // Ensure parent comment belongs to the same post
            if (parentComment.postId !== createCommentDto.postId) {
                throw new ForbiddenException('Parent comment must belong to the same post');
            }
        }

        return this.prisma.comment.create({
            data: {
                content: createCommentDto.content,
                postId: createCommentDto.postId,
                parentId: createCommentDto.parentId,
                authorId,
            },
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
        });
    }

    async findAll(options?: {
        skip?: number;
        take?: number;
        postId?: string;
    }) {
        const { skip = 0, take = 20, postId } = options || {};

        const where: Prisma.CommentWhereInput = {
            deletedAt: null,
            parentId: null, // Only top-level comments
        };

        if (postId) {
            where.postId = postId;
        }

        const [comments, total] = await Promise.all([
            this.prisma.comment.findMany({
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
                        orderBy: { createdAt: 'asc' },
                    },
                    _count: {
                        select: { replies: true },
                    },
                },
            }),
            this.prisma.comment.count({ where }),
        ]);

        return {
            data: comments,
            meta: {
                total,
                skip,
                take,
                hasMore: skip + take < total,
            },
        };
    }

    async findOne(id: string) {
        const comment = await this.prisma.comment.findUnique({
            where: { id },
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
                    orderBy: { createdAt: 'asc' },
                },
            },
        });

        if (!comment || comment.deletedAt) {
            throw new NotFoundException('Comment not found');
        }

        return comment;
    }

    async findByPost(postId: string, options?: { skip?: number; take?: number }) {
        const { skip = 0, take = 50 } = options || {};

        const [comments, total] = await Promise.all([
            this.prisma.comment.findMany({
                where: {
                    postId,
                    parentId: null,
                    deletedAt: null,
                },
                skip,
                take,
                orderBy: { createdAt: 'desc' },
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
                        orderBy: { createdAt: 'asc' },
                    },
                },
            }),
            this.prisma.comment.count({
                where: {
                    postId,
                    parentId: null,
                    deletedAt: null,
                },
            }),
        ]);

        return {
            data: comments,
            meta: {
                total,
                skip,
                take,
                hasMore: skip + take < total,
            },
        };
    }

    async update(id: string, updateCommentDto: UpdateCommentDto, userId: string) {
        const comment = await this.prisma.comment.findUnique({
            where: { id },
        });

        if (!comment || comment.deletedAt) {
            throw new NotFoundException('Comment not found');
        }

        if (comment.authorId !== userId) {
            throw new ForbiddenException('You can only update your own comments');
        }

        return this.prisma.comment.update({
            where: { id },
            data: {
                content: updateCommentDto.content,
                updatedAt: new Date(),
            },
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
        });
    }

    async remove(id: string, userId: string, isAdmin: boolean = false) {
        const comment = await this.prisma.comment.findUnique({
            where: { id },
        });

        if (!comment || comment.deletedAt) {
            throw new NotFoundException('Comment not found');
        }

        if (comment.authorId !== userId && !isAdmin) {
            throw new ForbiddenException('You can only delete your own comments');
        }

        // Soft delete the comment and all its replies
        await this.prisma.$transaction([
            this.prisma.comment.update({
                where: { id },
                data: { deletedAt: new Date() },
            }),
            this.prisma.comment.updateMany({
                where: { parentId: id },
                data: { deletedAt: new Date() },
            }),
        ]);

        return { message: 'Comment deleted successfully' };
    }
}
