import { Controller, Post, Body, Res, Get, Param, Query, Logger } from '@nestjs/common';
import { AIService } from './ai.service';
import { JobsService } from '../jobs/jobs.service';
import { SearchService } from './search.service';
import { GeneratePostDto } from './dto/generate-post.dto';
import { GenerateSeoDto } from './dto/generate-seo.dto';
import { GenerateEmbeddingsDto } from './dto/generate-embeddings.dto';
import { SearchQueryDto } from './dto/search-query.dto';
import { Public } from '../common/decorators/public.decorator';
import type { Response } from 'express';

@Controller('ai')
export class AIController {
    private readonly logger = new Logger(AIController.name);

    constructor(
        private readonly aiService: AIService,
        private readonly jobsService: JobsService,
        private readonly searchService: SearchService,
    ) { }

    @Post('generate')
    async generatePost(@Body() generatePostDto: GeneratePostDto) {
        this.logger.log(`Generating post for topic: ${generatePostDto.topic}`);
        const content = await this.aiService.generatePostContent(
            generatePostDto.topic,
            generatePostDto.outline,
        );
        return { content };
    }

    @Post('generate/stream')
    async generatePostStream(
        @Body() generatePostDto: GeneratePostDto,
        @Res() res: Response,
    ) {
        this.logger.log(`Streaming post generation for topic: ${generatePostDto.topic}`);

        res.setHeader('Content-Type', 'text/event-stream');
        res.setHeader('Cache-Control', 'no-cache');
        res.setHeader('Connection', 'keep-alive');

        try {
            const stream = await this.aiService.generatePostContentStream(generatePostDto.topic);
            stream.pipe(res);
        } catch (error) {
            this.logger.error('Stream generation failed', error);
            res.status(500).json({ error: 'Failed to generate stream' });
        }
    }

    @Post('seo')
    async generateSeo(@Body() generateSeoDto: GenerateSeoDto) {
        this.logger.log('Generating SEO metadata');
        return this.aiService.generateSeo(generateSeoDto.content);
    }

    @Post('tags')
    async generateTags(@Body() generateSeoDto: GenerateSeoDto) {
        this.logger.log('Generating tags');
        const tags = await this.aiService.generateTags(generateSeoDto.content);
        return { tags };
    }

    @Public()
    @Get('search')
    async search(@Query() searchQueryDto: SearchQueryDto) {
        this.logger.log(`Searching for: ${searchQueryDto.q}`);
        return this.searchService.search(searchQueryDto.q, searchQueryDto.limit);
    }

    // --- Background Job Endpoints ---

    @Post('queue/generate')
    async queueGeneratePost(@Body() generatePostDto: GeneratePostDto) {
        this.logger.log(`Queueing article generation for topic: ${generatePostDto.topic}`);
        const job = await this.jobsService.addArticleJob(
            generatePostDto.topic,
            generatePostDto.outline,
        );
        return { jobId: job.id, queue: 'article-queue' };
    }

    @Post('queue/seo')
    async queueSeo(@Body() generateSeoDto: GenerateSeoDto) {
        this.logger.log('Queueing SEO generation');
        const job = await this.jobsService.addSeoJob(generateSeoDto.content);
        return { jobId: job.id, queue: 'seo-queue' };
    }

    @Post('queue/embeddings')
    async queueEmbeddings(@Body() generateEmbeddingsDto: GenerateEmbeddingsDto) {
        this.logger.log(`Queueing embeddings for post: ${generateEmbeddingsDto.postId}`);
        const job = await this.jobsService.addEmbeddingsJob(
            generateEmbeddingsDto.content,
            generateEmbeddingsDto.postId,
        );
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

    // --- Additional AI Endpoints ---

    @Post('ideas')
    async generateIdeas(@Body() body: { niche?: string; count?: number }) {
        this.logger.log(`Generating blog ideas${body.niche ? ` for niche: ${body.niche}` : ''}`);
        const ideas = await this.aiService.generateBlogIdeas(body.niche, body.count);
        return { ideas };
    }

    @Post('rewrite')
    async rewriteContent(@Body() body: { content: string; style?: string }) {
        this.logger.log('Rewriting content');
        const rewritten = await this.aiService.rewriteContent(body.content, body.style);
        return { content: rewritten };
    }

    @Post('expand')
    async expandContent(@Body() body: { content: string }) {
        this.logger.log('Expanding content');
        const expanded = await this.aiService.expandContent(body.content);
        return { content: expanded };
    }

    @Post('summarize')
    async summarizeContent(@Body() body: { content: string }) {
        this.logger.log('Summarizing content');
        const summary = await this.aiService.summarizeContentWithAI(body.content);
        return { summary };
    }
}

