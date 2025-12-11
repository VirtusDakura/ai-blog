import { Injectable } from '@nestjs/common';
import { InjectQueue } from '@nestjs/bullmq';
import { Queue } from 'bullmq';
import { ARTICLE_QUEUE, SEO_QUEUE, JOB_GENERATE_ARTICLE, JOB_GENERATE_SEO, JOB_GENERATE_EMBEDDINGS } from './jobs.constants';

@Injectable()
export class JobsService {
    constructor(
        @InjectQueue(ARTICLE_QUEUE) private articleQueue: Queue,
        @InjectQueue(SEO_QUEUE) private seoQueue: Queue,
    ) { }

    async addArticleJob(topic: string, outline?: string) {
        return this.articleQueue.add(JOB_GENERATE_ARTICLE, { topic, outline });
    }

    async addSeoJob(content: string) {
        return this.seoQueue.add(JOB_GENERATE_SEO, { content });
    }

    async addEmbeddingsJob(content: string, postId: string) {
        return this.seoQueue.add(JOB_GENERATE_EMBEDDINGS, { content, postId });
    }

    async getJobStatus(queueName: string, jobId: string) {
        if (queueName === ARTICLE_QUEUE) {
            return this.articleQueue.getJob(jobId);
        } else if (queueName === SEO_QUEUE) {
            return this.seoQueue.getJob(jobId);
        }
        return null;
    }
}
