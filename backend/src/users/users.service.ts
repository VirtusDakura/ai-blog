import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UsersService {
    constructor(private prisma: PrismaService) { }

    async findAll(options?: { skip?: number; take?: number }) {
        const { skip = 0, take = 10 } = options || {};

        const [users, total] = await Promise.all([
            this.prisma.user.findMany({
                where: { deletedAt: null },
                skip,
                take,
                orderBy: { createdAt: 'desc' },
                select: {
                    id: true,
                    email: true,
                    firstName: true,
                    lastName: true,
                    avatarUrl: true,
                    role: true,
                    createdAt: true,
                    _count: {
                        select: { posts: true },
                    },
                },
            }),
            this.prisma.user.count({ where: { deletedAt: null } }),
        ]);

        return {
            data: users,
            meta: {
                total,
                skip,
                take,
                hasMore: skip + take < total,
            },
        };
    }

    async findOne(id: string) {
        const user = await this.prisma.user.findUnique({
            where: { id },
            select: {
                id: true,
                email: true,
                firstName: true,
                lastName: true,
                bio: true,
                avatarUrl: true,
                role: true,
                createdAt: true,
                _count: {
                    select: { posts: true, comments: true },
                },
            },
        });

        if (!user) {
            throw new NotFoundException('User not found');
        }

        return user;
    }

    async findByEmail(email: string) {
        const user = await this.prisma.user.findUnique({
            where: { email },
            select: {
                id: true,
                email: true,
                firstName: true,
                lastName: true,
                bio: true,
                avatarUrl: true,
                role: true,
                createdAt: true,
            },
        });

        if (!user) {
            throw new NotFoundException('User not found');
        }

        return user;
    }

    async update(id: string, updateUserDto: UpdateUserDto) {
        const user = await this.prisma.user.findUnique({
            where: { id },
        });

        if (!user) {
            throw new NotFoundException('User not found');
        }

        return this.prisma.user.update({
            where: { id },
            data: updateUserDto,
            select: {
                id: true,
                email: true,
                firstName: true,
                lastName: true,
                bio: true,
                avatarUrl: true,
                role: true,
                updatedAt: true,
            },
        });
    }

    async getUserPosts(id: string, options?: { skip?: number; take?: number; published?: boolean }) {
        const { skip = 0, take = 10, published } = options || {};

        const user = await this.prisma.user.findUnique({
            where: { id },
        });

        if (!user) {
            throw new NotFoundException('User not found');
        }

        const where: any = {
            authorId: id,
            deletedAt: null,
        };

        if (published !== undefined) {
            where.isPublished = published;
        }

        const [posts, total] = await Promise.all([
            this.prisma.post.findMany({
                where,
                skip,
                take,
                orderBy: { createdAt: 'desc' },
                select: {
                    id: true,
                    title: true,
                    slug: true,
                    excerpt: true,
                    coverImage: true,
                    isPublished: true,
                    publishedAt: true,
                    createdAt: true,
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
}
