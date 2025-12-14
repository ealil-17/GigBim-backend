import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty } from 'class-validator';

export class DevLoginRequestDto {
    @ApiProperty({ description: 'Email to login with', example: 'dev@example.com' })
    @IsEmail()
    @IsNotEmpty()
    email: string;
}

export class DevLoginResponseDto {
    @ApiProperty({ description: 'JWT Token' })
    token: string;

    @ApiProperty({ description: 'User information' })
    user: any;
}
