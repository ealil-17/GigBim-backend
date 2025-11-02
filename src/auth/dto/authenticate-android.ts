import { ApiProperty } from '@nestjs/swagger';

export class AndroidTokenDto {
	@ApiProperty({ example: 'eyJhbGciOiJSUzI1NiIsImtpZCI6Ij...', description: 'Google ID token from Android client' })
	idToken: string;
}
