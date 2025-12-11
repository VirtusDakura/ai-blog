import { Module } from '@nestjs/common';
import { AIService } from './ai.service';
import { AIController } from './ai.controller';
import { GroqProvider } from './groq.provider';
import { HuggingFaceProvider } from './huggingface.provider';
import { SeoService } from './seo.service';
import { EmbeddingsService } from './embeddings.service';

@Module({
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
