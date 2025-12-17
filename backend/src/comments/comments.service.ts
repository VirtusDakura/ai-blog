import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';
import { Prisma, CommentStatus } from '@prisma/client';

@Injectable()
export class CommentsService {
    constructor(private prisma: PrismaService) { }

    async create(createCommentDto: CreateCommentDto, authorId?: string) {
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
                guestName: createCommentDto.guestName,
                guestEmail: createCommentDto.guestEmail,
                status: 'PENDING', // All new comments start as pending
            },
            include: {
                author: {
                    select: {
                        id: true,
                        firstName: true,
                        lastName: true,
                        displayName: true,
                        avatarUrl: true,
                    },
                },
                post: {
                    select: {
                        id: true,
                        title: true,
                        slug: true,
                    }
                }
            },
        });
    }

    // Get all comments for a blog owner (for moderation)
    async getCommentsForModeration(userId: string, options?: {
        skip?: number;
        take?: number;
        status?: CommentStatus;
    }) {
        const { skip = 0, take = 50, status } = options || {};

        // Get posts by this user
        const where: Prisma.CommentWhereInput = {
            deletedAt: null,
            post: {
                authorId: userId,
            }
        };

        if (status) {
            where.status = status;
        }

        const [comments, total, pending, approved, spam] = await Promise.all([
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
                            displayName: true,
                            avatarUrl: true,
                        },
                    },
                    post: {
                        select: {
                            id: true,
                            title: true,
                            slug: true,
                        }
                    }
                },
            }),
            this.prisma.comment.count({ where }),
            this.prisma.comment.count({ where: { ...where, status: 'PENDING' } }),
            this.prisma.comment.count({ where: { ...where, status: 'APPROVED' } }),
            this.prisma.comment.count({ where: { ...where, status: 'SPAM' } }),
        ]);

        return {
            data: comments.map(c => ({
                id: c.id,
                content: c.content,
                status: c.status,
                author: c.author ? c.author.displayName || `${c.author.firstName} ${c.author.lastName}` : c.guestName || 'Anonymous',
                email: c.author?.id || c.guestEmail,
                postTitle: c.post.title,
                postSlug: c.post.slug,
                createdAt: c.createdAt,
            })),
            meta: {
                total,
                pending,
                approved,
                spam,
                skip,
                take,
            },
        };
    }

    // Moderate a comment
    async moderateComment(id: string, userId: string, action: 'approve' | 'reject' | 'spam') {
        const comment = await this.prisma.comment.findUnique({
            where: { id },
            include: { post: true },
        });

        if (!comment || comment.deletedAt) {
            throw new NotFoundException('Comment not found');
        }

        // Check if user owns the post
        if (comment.post.authorId !== userId) {
            throw new ForbiddenException('You can only moderate comments on your own posts');
        }

        const statusMap: Record<string, CommentStatus> = {
            approve: 'APPROVED',
            reject: 'REJECTED',
            spam: 'SPAM',
        };

        return this.prisma.comment.update({
            where: { id },
            data: { status: statusMap[action] },
        });
    }

    // Bulk moderate comments
    async bulkModerate(ids: string[], userId: string, action: 'approve' | 'reject' | 'spam' | 'delete') {
        const statusMap: Record<string, CommentStatus> = {
            approve: 'APPROVED',
            reject: 'REJECTED',
            spam: 'SPAM',
        };

        if (action === 'delete') {
            await this.prisma.comment.updateMany({
                where: {
                    id: { in: ids },
                    post: { authorId: userId },
                },
                data: { deletedAt: new Date() },
            });
        } else {
            await this.prisma.comment.updateMany({
                where: {
                    id: { in: ids },
                    post: { authorId: userId },
                },
                data: { status: statusMap[action] },
            });
        }

        return { success: true, count: ids.length };
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
            status: 'APPROVED', // Only show approved comments publicly
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
                            displayName: true,
                            avatarUrl: true,
                        },
                    },
                    replies: {
                        where: { deletedAt: null, status: 'APPROVED' },
                        include: {
                            author: {
                                select: {
                                    id: true,
                                    firstName: true,
                                    lastName: true,
                                    displayName: true,
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
                        displayName: true,
                        avatarUrl: true,
                    },
                },
                replies: {
                    where: { deletedAt: null, status: 'APPROVED' },
                    include: {
                        author: {
                            select: {
                                id: true,
                                firstName: true,
                                lastName: true,
                                displayName: true,
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
                    status: 'APPROVED',
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
                            displayName: true,
                            avatarUrl: true,
                        },
                    },
                    replies: {
                        where: { deletedAt: null, status: 'APPROVED' },
                        include: {
                            author: {
                                select: {
                                    id: true,
                                    firstName: true,
                                    lastName: true,
                                    displayName: true,
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
                    status: 'APPROVED',
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
                        displayName: true,
                        avatarUrl: true,
                    },
                },
            },
        });
    }

    async remove(id: string, userId: string, isAdmin: boolean = false) {
        const comment = await this.prisma.comment.findUnique({
            where: { id },
            include: { post: true },
        });

        if (!comment || comment.deletedAt) {
            throw new NotFoundException('Comment not found');
        }

        // Allow deletion by comment author, post author, or admin
        if (comment.authorId !== userId && comment.post.authorId !== userId && !isAdmin) {
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

    // Reply to a comment as the blog owner
    async replyAsOwner(commentId: string, userId: string, content: string) {
        const comment = await this.prisma.comment.findUnique({
            where: { id: commentId },
            include: { post: true },
        });

        if (!comment || comment.deletedAt) {
            throw new NotFoundException('Comment not found');
        }

        if (comment.post.authorId !== userId) {
            throw new ForbiddenException('Only the post author can reply as owner');
        }

        return this.prisma.comment.create({
            data: {
                content,
                postId: comment.postId,
                parentId: commentId,
                authorId: userId,
                status: 'APPROVED', // Owner replies are auto-approved
            },
            include: {
                author: {
                    select: {
                        id: true,
                        firstName: true,
                        lastName: true,
                        displayName: true,
                        avatarUrl: true,
                    },
                },
            },
        });
    }
}
