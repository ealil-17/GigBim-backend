import { ApiProperty } from '@nestjs/swagger';

export class ValidateTokenRequestDto {
    @ApiProperty({ description: 'JWT Token to validate' })
    token: string;
}

export class ValidateTokenResponseDto {
    @ApiProperty({ description: 'Whether the token is valid' })
    isValid: boolean;

    @ApiProperty({ description: 'Whether the user is in the free trial period' })
    isFreeTrial: boolean;

    @ApiProperty({ description: 'Days remaining in the trial period' })
    daysRemaining: number;

    @ApiProperty({ description: 'User information', required: false })
    user?: any;
}
