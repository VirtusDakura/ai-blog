import { Module } from '@nestjs/common';
import { AIService } from './ai.service';
import { AIController } from './ai.controller';
import { GroqProvider } from './groq.provider';
import { HuggingFaceProvider } from './huggingface.provider';
import { SeoService } from './seo.service';
import { EmbeddingsService } from './embeddings.service';
import { JobsModule } from '../jobs/jobs.module'; // Import to use JobsService

@Module({
    imports: [JobsModule],
    controllers: [AIController],
    providers: [
        AIService,
        GroqProvider,
        HuggingFaceProvider,
        SeoService,
        EmbeddingsService,
    ],
    exports: [AIService],
})
export class AIModule { }
