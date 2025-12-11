import { Injectable, Logger } from '@nestjs/common';
import axios from 'axios';

@Injectable()
export class HuggingFaceProvider {
    private readonly logger = new Logger(HuggingFaceProvider.name);
    private readonly apiKey = process.env.HF_API_TOKEN;
    private readonly baseUrl = 'https://api-inference.huggingface.co/models';

    // Default models for different tasks
    private readonly models = {
        summarization: 'facebook/bart-large-cnn',
        generation: 'mistralai/Mistral-7B-Instruct-v0.3',
    };

    async generateSummary(text: string): Promise<string> {
        try {
            const response = await axios.post(
                `${this.baseUrl}/${this.models.summarization}`,
                { inputs: text, parameters: { min_length: 50, max_length: 200 } },
                {
                    headers: {
                        Authorization: `Bearer ${this.apiKey}`,
                        'Content-Type': 'application/json',
                    },
                },
            );

            // HF summarization usually returns [{ summary_text: "..." }]
            if (Array.isArray(response.data) && response.data[0]?.summary_text) {
                return response.data[0].summary_text;
            }
            return '';
        } catch (error) {
            this.logger.error('Error generating summary with HF', error.response?.data || error.message);
            throw new Error('Failed to generate summary using HuggingFace');
        }
    }

    async generateText(prompt: string, model?: string): Promise<string> {
        const modelId = model || this.models.generation;
        try {
            const response = await axios.post(
                `${this.baseUrl}/${modelId}`,
                { inputs: prompt, parameters: { max_new_tokens: 512, return_full_text: false } },
                {
                    headers: {
                        Authorization: `Bearer ${this.apiKey}`,
                        'Content-Type': 'application/json',
                    },
                },
            );

            // Text generation usually returns [{ generated_text: "..." }]
            if (Array.isArray(response.data) && response.data[0]?.generated_text) {
                return response.data[0].generated_text;
            }
            return '';
        } catch (error) {
            this.logger.error('Error generating text with HF', error.response?.data || error.message);
            throw new Error('Failed to generate text using HuggingFace');
        }
    }
}
