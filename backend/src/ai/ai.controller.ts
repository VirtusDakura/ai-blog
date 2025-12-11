import { Controller, Post, Body, Res, BadRequestException } from '@nestjs/common';
import { AIService } from './ai.service';
import type { Response } from 'express';

@Controller('ai')
export class AIController {
    constructor(private readonly aiService: AIService) { }

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
        if (!body.content) {
            throw new BadRequestException('Content is required');
        }
        return this.aiService.generateSeo(body.content);
    }

    @Post('tags')
    async generateTags(@Body() body: { content: string }) {
        if (!body.content) {
            throw new BadRequestException('Content is required');
        }
        const tags = await this.aiService.generateTags(body.content);
        return { tags };
    }
}
