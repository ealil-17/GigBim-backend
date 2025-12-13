import { ApiProperty } from '@nestjs/swagger';

export class AiResponseDto {
	@ApiProperty({ description: 'AI generated response text', example: 'This is the generated response.' })
	response: string;
}
