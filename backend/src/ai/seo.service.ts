import { Injectable } from '@nestjs/common';
import { HuggingFaceProvider } from './huggingface.provider';

export interface SeoMetadata {
    title: string;
    description: string;
    keywords: string[];
}

@Injectable()
export class SeoService {
    constructor(private readonly hfProvider: HuggingFaceProvider) { }

    async generateSeoMetadata(content: string): Promise<SeoMetadata> {
        const prompt = `
      Analyze the following blog post content and generate SEO metadata in JSON format.
      Return ONLY valid JSON with keys: "title" (max 60 chars), "description" (max 160 chars), and "keywords" (array of strings).
      
      Content:
      ${content.substring(0, 3000)}... (truncated)
    `;

        const rawResponse = await this.hfProvider.generateText(prompt);

        // Attempt to parse JSON from the response
        try {
            // Find JSON block if wrapped in markdown
            const jsonMatch = rawResponse.match(/\{[\s\S]*\}/);
            const jsonStr = jsonMatch ? jsonMatch[0] : rawResponse;

            const parsed = JSON.parse(jsonStr);
            return {
                title: parsed.title || 'Untitled Post',
                description: parsed.description || 'No description available.',
                keywords: parsed.keywords || [],
            };
        } catch (e) {
            // Fallback if JSON parsing fails
            return {
                title: 'Generated Title Error',
                description: 'Could not generate description automatically.',
                keywords: [],
            };
        }
    }

    async generateTags(content: string): Promise<string[]> {
        const prompt = `
      Generate 5 relevant tags for the following blog post content. Return them as a comma-separated list.
      
      Content:
      ${content.substring(0, 2000)}
      `;

        const response = await this.hfProvider.generateText(prompt);
        return response.split(',').map(t => t.trim()).filter(t => t.length > 0);
    }
}
