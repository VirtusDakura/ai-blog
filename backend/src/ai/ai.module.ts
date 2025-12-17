import { Module, forwardRef } from '@nestjs/common';
import { AIService } from './ai.service';
import { AIController } from './ai.controller';
import { GroqProvider } from './groq.provider';
import { HuggingFaceProvider } from './huggingface.provider';
import { SeoService } from './seo.service';
import { EmbeddingsService } from './embeddings.service';
import { SearchService } from './search.service';
import { JobsModule } from '../jobs/jobs.module';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
    imports: [forwardRef(() => JobsModule), PrismaModule],
    controllers: [AIController],
    providers: [
        AIService,
        GroqProvider,
        HuggingFaceProvider,
        SeoService,
        EmbeddingsService,
        SearchService,
    ],
    exports: [AIService, SearchService],
})
export class AIModule { }
