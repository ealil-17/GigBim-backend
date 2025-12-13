import { Body, Controller, Post } from '@nestjs/common';
import { AiModelService } from './ai-model.service';

@Controller('ai-model')
export class AiModelController {
    constructor(private readonly aiModelService: AiModelService) { }

    @Post()
    async getAiResponse(@Body('prompt') prompt: string) {
        const response = await this.aiModelService.getAiResponse(prompt);
        return { response };
    }
}
