import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateCategoryDto, UpdateCategoryDto, CreateTagDto } from './dto/category.dto';

@Injectable()
export class CategoriesService {
    constructor(private prisma: PrismaService) { }

    // Categories
    async createCategory(dto: CreateCategoryDto) {
        const slug = dto.name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');

        // Check if slug already exists for this user
        const existing = await this.prisma.category.findUnique({
            where: { userId_slug: { userId: dto.userId, slug } }
        });

        if (existing) {
            throw new ConflictException('Category with this name already exists');
        }

        return this.prisma.category.create({
            data: {
                name: dto.name,
                slug,
                description: dto.description,
                color: dto.color || '#8b5cf6',
                userId: dto.userId,
            },
            include: { _count: { select: { posts: true } } }
        });
    }

    async getCategories(userId: string) {
        const categories = await this.prisma.category.findMany({
            where: { userId },
            include: { _count: { select: { posts: true } } },
            orderBy: { sortOrder: 'asc' }
        });

        return categories.map(cat => ({
            id: cat.id,
            name: cat.name,
            slug: cat.slug,
            description: cat.description,
            color: cat.color,
            postCount: cat._count.posts,
        }));
    }

    async updateCategory(id: string, userId: string, dto: UpdateCategoryDto) {
        const category = await this.prisma.category.findFirst({
            where: { id, userId }
        });

        if (!category) {
            throw new NotFoundException('Category not found');
        }

        const updateData: any = {};
        if (dto.name) {
            updateData.name = dto.name;
            updateData.slug = dto.name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
        }
        if (dto.description !== undefined) updateData.description = dto.description;
        if (dto.color) updateData.color = dto.color;

        return this.prisma.category.update({
            where: { id },
            data: updateData,
        });
    }

    async deleteCategory(id: string, userId: string) {
        const category = await this.prisma.category.findFirst({
            where: { id, userId }
        });

        if (!category) {
            throw new NotFoundException('Category not found');
        }

        await this.prisma.category.delete({ where: { id } });
        return { success: true };
    }

    // Tags
    async createTag(dto: CreateTagDto) {
        const name = dto.name.toLowerCase().replace(/\s+/g, '-');

        // Check if tag already exists
        const existing = await this.prisma.tag.findUnique({
            where: { userId_name: { userId: dto.userId, name } }
        });

        if (existing) {
            return existing;
        }

        return this.prisma.tag.create({
            data: {
                name,
                userId: dto.userId,
            }
        });
    }

    async getTags(userId: string) {
        const tags = await this.prisma.tag.findMany({
            where: { userId },
            include: { _count: { select: { posts: true } } },
            orderBy: { createdAt: 'desc' }
        });

        return tags.map(tag => ({
            id: tag.id,
            name: tag.name,
            postCount: tag._count.posts,
        }));
    }

    async deleteTag(id: string, userId: string) {
        const tag = await this.prisma.tag.findFirst({
            where: { id, userId }
        });

        if (!tag) {
            throw new NotFoundException('Tag not found');
        }

        await this.prisma.tag.delete({ where: { id } });
        return { success: true };
    }
}
