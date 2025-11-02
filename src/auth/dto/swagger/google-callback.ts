import { ApiProperty } from '@nestjs/swagger';

export class GoogleUserDto {
	@ApiProperty({ example: 'd9f8a1e2-...' })
	id: string;

	@ApiProperty({ example: 'johndoe' })
	username: string;

	@ApiProperty({ example: 'John Doe' })
	name: string;

	@ApiProperty({ example: 'A short bio', required: false })
	bio?: string | null;

	@ApiProperty({ example: 'https://...' , required: false })
	avatarUrl?: string | null;

	@ApiProperty({ example: 'johndoe@example.com' })
	email: string;

	@ApiProperty({ example: 'user' })
	role: string;

	@ApiProperty({ type: String, format: 'date-time' })
	createdAt: string;

	@ApiProperty({ type: String, format: 'date-time', required: false })
	updatedAt?: string | null;
}

export class GoogleCallbackResponseDto {
	@ApiProperty({ example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...' })
	token: string;

	@ApiProperty({ type: GoogleUserDto })
	user: GoogleUserDto;
}

// New: DTO used by Android clients to POST Google idToken
export class AndroidTokenResponseDto {
	@ApiProperty({ example: 'eyJhbGciOiJSUzI1NiIsImtpZCI6Ij...' })
	idToken: string;
}