import { Body, Controller, Post, UseGuards, Req, ForbiddenException } from '@nestjs/common';
import { AiModelService } from './ai-model.service';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard'; // Adjust path if needed
import { ApiTags, ApiBearerAuth, ApiOperation, ApiOkResponse, ApiForbiddenResponse, ApiBody } from '@nestjs/swagger';
import { CreateAiRequestDto } from './dto/create-ai-request.dto';
import { AiResponseDto } from './dto/ai-response.dto';

@Controller('ai-model')
@ApiTags('AI Model')
@ApiBearerAuth('JWT')
export class AiModelController {
    constructor(private readonly aiModelService: AiModelService) { }

    @UseGuards(JwtAuthGuard)
    @Post()
    @ApiOperation({ summary: 'Get AI response for a prompt' })
    @ApiBody({ type: CreateAiRequestDto })
    @ApiOkResponse({ type: AiResponseDto })
    @ApiForbiddenResponse({ description: 'Free trial expired. Please upgrade to continue.' })
    async getAiResponse(@Body() dto: CreateAiRequestDto, @Req() req: any): Promise<AiResponseDto> {
        try {
            const response = await this.aiModelService.getAiResponse(dto.prompt, req.user);
            return { response };
        } catch (error) {
            if (error.message.includes('Free trial')) {
                throw new ForbiddenException(error.message);
            }
            throw error;
        }
    }
}
