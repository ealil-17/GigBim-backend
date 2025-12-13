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

    async getAiResponse(prompt: string, user: any): Promise<string> {
        const trialDays = 7;
        const now = new Date();
        const created = new Date(user.createdAt);
        const diffTime = Math.abs(now.getTime() - created.getTime());
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

        if (diffDays > trialDays) {
            throw new Error('Free trial expired. Please upgrade to continue.');
        }

        const completion = await this.openai.chat.completions.create({
            messages: [{ role: 'user', content: prompt }],
            model: 'gpt-3.5-turbo',
        });

        return completion.choices[0].message.content || 'No response from AI';
    }
}
