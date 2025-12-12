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

    // --- Blog Ideas ---

    async generateBlogIdeas(niche?: string, count: number = 5): Promise<string[]> {
        const nicheContext = niche ? `in the ${niche} niche` : 'for a general audience blog';
        const prompt = `Generate ${count} unique and engaging blog post ideas ${nicheContext}. 
        
For each idea, provide:
- A catchy title
- A brief one-line description

Format as a numbered list. Be creative and focus on topics that will engage readers.`;

        const response = await this.groqProvider.generateText(prompt, 'You are a content strategist and blog expert.');

        // Parse the response to extract ideas
        const ideas = response
            .split(/\d+\.\s+/)
            .filter(idea => idea.trim().length > 0)
            .map(idea => idea.trim())
            .slice(0, count);

        return ideas;
    }

    // --- Rewriting & Expansion ---

    async rewriteContent(content: string, style?: string): Promise<string> {
        const styleInstructions = style
            ? `Rewrite in a ${style} style.`
            : 'Rewrite to be clearer and more engaging.';

        const prompt = `${styleInstructions}

Original content:
${content}

Rewritten content:`;

        return this.groqProvider.generateText(prompt, 'You are an expert editor and writer.');
    }

    async expandContent(content: string): Promise<string> {
        const prompt = `Expand the following content with more details, examples, and explanations while maintaining the original tone and message:

Original:
${content}

Expanded version:`;

        return this.groqProvider.generateText(prompt, 'You are an expert writer who adds depth to content.');
    }

    async summarizeContentWithAI(content: string): Promise<string> {
        const prompt = `Provide a concise summary of the following content in 2-3 sentences:

${content}

Summary:`;

        return this.groqProvider.generateText(prompt, 'You are an expert at distilling information.');
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

