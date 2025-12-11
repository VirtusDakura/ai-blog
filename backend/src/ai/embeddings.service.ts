import { Injectable, Logger } from '@nestjs/common';
import axios from 'axios';

@Injectable()
export class EmbeddingsService {
    private readonly logger = new Logger(EmbeddingsService.name);
    private readonly apiKey = process.env.HF_API_TOKEN;
    private readonly modelUrl = 'https://api-inference.huggingface.co/pipeline/feature-extraction/sentence-transformers/all-MiniLM-L6-v2';

    async generateEmbedding(text: string): Promise<number[]> {
        try {
            const response = await axios.post(
                this.modelUrl,
                {
                    inputs: text,
                    options: { wait_for_model: true }
                },
                {
                    headers: {
                        Authorization: `Bearer ${this.apiKey}`,
                        'Content-Type': 'application/json',
                    },
                },
            );

            // Embedding response is usually a list of numbers (or list of list if batch)
            if (Array.isArray(response.data)) {
                // Handle batch or single
                if (Array.isArray(response.data[0])) {
                    return response.data[0] as number[];
                }
                return response.data as number[];
            }
            throw new Error('Invalid format from embedding API');
        } catch (error) {
            this.logger.error('Error generating embedding', error.response?.data || error.message);
            throw new Error('Failed to generate embedding');
        }
    }
}
