import { Injectable } from '@nestjs/common';
import OpenAI from 'openai';

@Injectable()
export class AiModelService {
    private openai: OpenAI;

    constructor() {
        this.openai = new OpenAI({
            apiKey: process.env.OPENAI_API_KEY,
        });
    }

    async getAiResponse(prompt: string): Promise<string> {
        const completion = await this.openai.chat.completions.create({
            messages: [{ role: 'user', content: prompt }],
            model: 'gpt-3.5-turbo',
        });

        return completion.choices[0].message.content || 'No response from AI';
    }
}
