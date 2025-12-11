import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Job } from 'bullmq';
import { Logger } from '@nestjs/common';
import { AIService } from '../ai/ai.service';
import { SearchService } from '../ai/search.service';
import { SEO_QUEUE, JOB_GENERATE_SEO, JOB_GENERATE_EMBEDDINGS } from './jobs.constants';

@Processor(SEO_QUEUE)
export class SeoProcessor extends WorkerHost {
    private readonly logger = new Logger(SeoProcessor.name);

    constructor(
        private readonly aiService: AIService,
        private readonly searchService: SearchService,
    ) {
        super();
    }

    async process(job: Job<any, any, string>): Promise<any> {
        switch (job.name) {
            case JOB_GENERATE_SEO:
                return this.handleGenerateSeo(job);
            case JOB_GENERATE_EMBEDDINGS:
                return this.handleGenerateEmbeddings(job);
            default:
                throw new Error(`Unknown job name: ${job.name}`);
        }
    }

    private async handleGenerateSeo(job: Job) {
        this.logger.log(`Processing SEO generation for job ${job.id}`);
        const { content } = job.data;
        const metadata = await this.aiService.generateSeo(content);
        return metadata;
    }

    private async handleGenerateEmbeddings(job: Job) {
        this.logger.log(`Processing Embeddings generation for job ${job.id}`);
        const { content, postId } = job.data;
        const vector = await this.aiService.getEmbeddings(content);

        // Save to DB
        const result = await this.searchService.saveEmbedding(postId, content, vector);

        return { vectorId: result.id };
    }
}
