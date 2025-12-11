import { Injectable } from '@nestjs/common';
import { GroqProvider } from './groq.provider';
import { HuggingFaceProvider } from './huggingface.provider';
import { SeoService, SeoMetadata } from './seo.service';
import { EmbeddingsService } from './embeddings.service';

@Injectable()
export class AIService {
    constructor(
        private readonly groqProvider: GroqProvider,
        private readonly hfProvider: HuggingFaceProvider,
        private readonly seoService: SeoService,
        private readonly embeddingsService: EmbeddingsService,
    ) { }

    // --- Groq (Long Content) ---

    async generatePostContent(topic: string, outline?: string): Promise<string> {
        const prompt = `Write a comprehensive and engaging blog post about "${topic}". ${outline ? `Follow this outline: ${outline}` : ''}
    Use markdown formatting.`;

        return this.groqProvider.generateText(prompt, 'You are an expert blog post writer.');
    }

    async generatePostContentStream(topic: string) {
        const prompt = `Write a comprehensive blog post about "${topic}". Use markdown.`;
        return this.groqProvider.generateTextStream(prompt, 'You are an expert blog post writer.');
    }

    // --- HuggingFace (Summaries & Utilities) ---

    async summarizeContent(content: string): Promise<string> {
        return this.hfProvider.generateSummary(content);
    }

    // --- SEO & Tags ---

    async generateSeo(content: string): Promise<SeoMetadata> {
        return this.seoService.generateSeoMetadata(content);
    }

    async generateTags(content: string): Promise<string[]> {
        return this.seoService.generateTags(content);
    }

    // --- Embeddings ---

    async getEmbeddings(text: string): Promise<number[]> {
        return this.embeddingsService.generateEmbedding(text);
    }
}
