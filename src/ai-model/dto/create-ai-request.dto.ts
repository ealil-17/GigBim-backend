import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, MaxLength } from 'class-validator';

export class CreateAiRequestDto {
	@ApiProperty({
		description: 'User prompt sent to the AI model',
		example: 'Write a short product description for a wireless mouse.',
		maxLength: 2000,
	})
	@IsString()
	@IsNotEmpty()
	@MaxLength(2000)
	prompt: string;
}
