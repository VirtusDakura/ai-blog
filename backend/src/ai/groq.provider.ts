import { Injectable, Logger } from '@nestjs/common';
import axios from 'axios';

@Injectable()
export class GroqProvider {
    private readonly logger = new Logger(GroqProvider.name);
    private readonly apiKey = process.env.GROQ_API_KEY;
    private readonly apiUrl = 'https://api.groq.com/openai/v1/chat/completions';
    private readonly model = 'llama-3.1-70b-versatile';

    async generateText(prompt: string, systemPrompt?: string): Promise<string> {
        try {
            const response = await axios.post(
                this.apiUrl,
                {
                    model: this.model,
                    messages: [
                        { role: 'system', content: systemPrompt || 'You are a helpful AI assistant.' },
                        { role: 'user', content: prompt },
                    ],
                    temperature: 0.7,
                },
                {
                    headers: {
                        Authorization: `Bearer ${this.apiKey}`,
                        'Content-Type': 'application/json',
                    },
                },
            );

            return response.data.choices[0].message.content;
        } catch (error) {
            this.logger.error('Error generating text with Groq', error.response?.data || error.message);
            throw new Error('Failed to generate text using Groq');
        }
    }

    // Basic streaming implementation using axios (returns a stream)
    async generateTextStream(prompt: string, systemPrompt?: string) {
        try {
            const response = await axios.post(
                this.apiUrl,
                {
                    model: this.model,
                    messages: [
                        { role: 'system', content: systemPrompt || 'You are a helpful AI assistant.' },
                        { role: 'user', content: prompt },
                    ],
                    stream: true,
                    temperature: 0.7,
                },
                {
                    headers: {
                        Authorization: `Bearer ${this.apiKey}`,
                        'Content-Type': 'application/json',
                    },
                    responseType: 'stream',
                },
            );

            return response.data;
        } catch (error) {
            this.logger.error('Error starting stream with Groq', error.response?.data || error.message);
            throw new Error('Failed to stream text using Groq');
        }
    }
}
