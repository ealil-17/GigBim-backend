import { Injectable } from '@nestjs/common';
import OpenAI from 'openai';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class AiModelService {
    private openai: OpenAI;

    constructor(private prisma: PrismaService) {
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

        const responseContent = completion.choices[0].message.content || 'No response from AI';

        // Store the interaction in the database
        await this.prisma.aiLog.create({
            data: {
                userId: user.id,
                prompt: prompt,
                response: responseContent,
            },
        });

        return responseContent;
    }
}
