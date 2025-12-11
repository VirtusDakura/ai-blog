import { Controller, Post, Body, Res, BadRequestException, Get, Param, Query } from '@nestjs/common';
import { AIService } from './ai.service';
import { JobsService } from '../jobs/jobs.service';
import { SearchService } from './search.service';
import type { Response } from 'express';

@Controller('ai')
export class AIController {
    constructor(
        private readonly aiService: AIService,
        private readonly jobsService: JobsService,
        private readonly searchService: SearchService,
    ) { }

    // ... existing sync endpoints ...

    @Post('generate')
    async generatePost(@Body() body: { topic: string; outline?: string }) {
        if (!body.topic) {
            throw new BadRequestException('Topic is required');
        }
        const content = await this.aiService.generatePostContent(body.topic, body.outline);
        return { content };
    }

    // Streaming endpoint
    @Post('generate/stream')
    async generatePostStream(@Body() body: { topic: string }, @Res() res: Response) {
        if (!body.topic) {
            throw new BadRequestException('Topic is required');
        }

        try {
            const stream = await this.aiService.generatePostContentStream(body.topic);
            stream.pipe(res);
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Failed to generate stream' });
        }
    }

    @Post('seo')
    async generateSeo(@Body() body: { content: string }) {
        return this.aiService.generateSeo(body.content);
    }

    @Post('tags')
    async generateTags(@Body() body: { content: string }) {
        const tags = await this.aiService.generateTags(body.content);
        return { tags };
    }

    // --- Search ---

    @Get('search')
    async search(@Query('q') query: string, @Query('limit') limit: string) {
        if (!query) {
            throw new BadRequestException('Query is required');
        }
        return this.searchService.search(query, limit ? parseInt(limit) : 5);
    }

    // --- Background Job Endpoints ---

    @Post('queue/generate')
    async queueGeneratePost(@Body() body: { topic: string; outline?: string }) {
        const job = await this.jobsService.addArticleJob(body.topic, body.outline);
        return { jobId: job.id, queue: 'article-queue' };
    }

    @Post('queue/seo')
    async queueSeo(@Body() body: { content: string }) {
        const job = await this.jobsService.addSeoJob(body.content);
        return { jobId: job.id, queue: 'seo-queue' };
    }

    @Post('queue/embeddings')
    async queueEmbeddings(@Body() body: { content: string; postId: string }) {
        if (!body.postId || !body.content) {
            throw new BadRequestException('Content and postId are required');
        }
        const job = await this.jobsService.addEmbeddingsJob(body.content, body.postId);
        return { jobId: job.id, queue: 'seo-queue' };
    }

    @Get('queue/:queue/:id')
    async getJobStatus(@Param('queue') queue: string, @Param('id') id: string) {
        const job = await this.jobsService.getJobStatus(queue, id);
        if (!job) {
            return { status: 'not found' };
        }
        const state = await job.getState();
        const result = job.returnvalue;
        const progress = job.progress;

        return { id: job.id, state, result, progress };
    }
}
