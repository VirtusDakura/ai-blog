import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Job } from 'bullmq';
import { Logger } from '@nestjs/common';
import { AIService } from '../ai/ai.service';
import { ARTICLE_QUEUE, JOB_GENERATE_ARTICLE } from './jobs.constants';

@Processor(ARTICLE_QUEUE)
export class ArticleProcessor extends WorkerHost {
    private readonly logger = new Logger(ArticleProcessor.name);

    constructor(private readonly aiService: AIService) {
        super();
    }

    async process(job: Job<any, any, string>): Promise<any> {
        switch (job.name) {
            case JOB_GENERATE_ARTICLE:
                return this.handleGenerateArticle(job);
            default:
                this.logger.warn(`Unknown job name in Article Queue: ${job.name}`);
                throw new Error(`Unknown job name: ${job.name}`);
        }
    }

    private async handleGenerateArticle(job: Job) {
        this.logger.log(`Processing article generation for job ${job.id}`);
        const { topic, outline } = job.data;

        // Simulate long running process updates
        await job.updateProgress(10);

        const content = await this.aiService.generatePostContent(topic, outline);
        await job.updateProgress(100);

        return { content };
    }
}
