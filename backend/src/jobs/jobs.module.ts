import { Module } from '@nestjs/common';
import { BullModule } from '@nestjs/bullmq';
import { ArticleProcessor } from './article.worker';
import { SeoProcessor } from './seo.worker';
import { JobsService } from './jobs.service';
import { AIModule } from '../ai/ai.module';
import { ARTICLE_QUEUE, SEO_QUEUE } from './jobs.constants';

// Default job options for proper cleanup and retry handling
const defaultJobOptions = {
    attempts: 3,
    backoff: {
        type: 'exponential',
        delay: 1000,
    },
    removeOnComplete: {
        count: 100, // Keep last 100 completed jobs
        age: 24 * 3600, // Remove completed jobs older than 24 hours
    },
    removeOnFail: {
        count: 1000, // Keep last 1000 failed jobs
        age: 7 * 24 * 3600, // Remove failed jobs older than 7 days
    },
};

@Module({
    imports: [
        AIModule,
        BullModule.registerQueue(
            {
                name: ARTICLE_QUEUE,
                defaultJobOptions: defaultJobOptions as any,
            },
            {
                name: SEO_QUEUE,
                defaultJobOptions: defaultJobOptions as any,
            },
        ),
    ],
    providers: [ArticleProcessor, SeoProcessor, JobsService],
    exports: [BullModule, JobsService],
})
export class JobsModule { }
