import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreatePageDto, UpdatePageDto } from './dto/page.dto';

@Injectable()
export class PagesService {
    constructor(private prisma: PrismaService) { }

    async createPage(dto: CreatePageDto) {
        const slug = dto.title.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');

        // Check if slug already exists for this user
        const existing = await this.prisma.page.findUnique({
            where: { userId_slug: { userId: dto.userId, slug } }
        });

        if (existing) {
            throw new ConflictException('Page with this title already exists');
        }

        return this.prisma.page.create({
            data: {
                title: dto.title,
                slug,
                content: dto.content,
                template: dto.template || 'default',
                seoTitle: dto.seoTitle,
                seoDescription: dto.seoDescription,
                userId: dto.userId,
            }
        });
    }

    async getPages(userId: string) {
        return this.prisma.page.findMany({
            where: { userId },
            orderBy: { sortOrder: 'asc' }
        });
    }

    async getPage(id: string, userId: string) {
        const page = await this.prisma.page.findFirst({
            where: { id, userId }
        });

        if (!page) {
            throw new NotFoundException('Page not found');
        }

        return page;
    }

    async getPageBySlug(userId: string, slug: string) {
        const page = await this.prisma.page.findUnique({
            where: { userId_slug: { userId, slug } }
        });

        if (!page) {
            throw new NotFoundException('Page not found');
        }

        return page;
    }

    async updatePage(id: string, userId: string, dto: UpdatePageDto) {
        const page = await this.prisma.page.findFirst({
            where: { id, userId }
        });

        if (!page) {
            throw new NotFoundException('Page not found');
        }

        const updateData: any = {};
        if (dto.title) {
            updateData.title = dto.title;
            updateData.slug = dto.title.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
        }
        if (dto.content !== undefined) updateData.content = dto.content;
        if (dto.template) updateData.template = dto.template;
        if (dto.status) updateData.status = dto.status;
        if (dto.sortOrder !== undefined) updateData.sortOrder = dto.sortOrder;
        if (dto.seoTitle !== undefined) updateData.seoTitle = dto.seoTitle;
        if (dto.seoDescription !== undefined) updateData.seoDescription = dto.seoDescription;

        return this.prisma.page.update({
            where: { id },
            data: updateData,
        });
    }

    async deletePage(id: string, userId: string) {
        const page = await this.prisma.page.findFirst({
            where: { id, userId }
        });

        if (!page) {
            throw new NotFoundException('Page not found');
        }

        if (page.isSystem) {
            throw new ConflictException('Cannot delete system pages');
        }

        await this.prisma.page.delete({ where: { id } });
        return { success: true };
    }

    async reorderPages(userId: string, pageOrders: { id: string; order: number }[]) {
        await Promise.all(
            pageOrders.map(({ id, order }) =>
                this.prisma.page.update({
                    where: { id },
                    data: { sortOrder: order }
                })
            )
        );
        return { success: true };
    }
}
