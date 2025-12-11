import { Module } from '@nestjs/common';
import { BullModule } from '@nestjs/bullmq';
import { ArticleProcessor } from './article.worker';
import { SeoProcessor } from './seo.worker';
import { JobsService } from './jobs.service';
import { AIModule } from '../ai/ai.module';
import { ARTICLE_QUEUE, SEO_QUEUE } from './jobs.constants';

@Module({
    imports: [
        AIModule,
        BullModule.registerQueue(
            { name: ARTICLE_QUEUE },
            { name: SEO_QUEUE },
        ),
    ],
    providers: [ArticleProcessor, SeoProcessor, JobsService],
    exports: [BullModule, JobsService],
})
export class JobsModule { }
