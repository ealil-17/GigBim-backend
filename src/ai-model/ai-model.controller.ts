import { Body, Controller, Post, UseGuards, Req, ForbiddenException } from '@nestjs/common';
import { AiModelService } from './ai-model.service';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard'; // Adjust path if needed

@Controller('ai-model')
export class AiModelController {
    constructor(private readonly aiModelService: AiModelService) { }

    @UseGuards(JwtAuthGuard)
    @Post()
    async getAiResponse(@Body('prompt') prompt: string, @Req() req: any) {
        try {
            const response = await this.aiModelService.getAiResponse(prompt, req.user);
            return { response };
        } catch (error) {
            if (error.message.includes('Free trial')) {
                throw new ForbiddenException(error.message);
            }
            throw error;
        }
    }
}
