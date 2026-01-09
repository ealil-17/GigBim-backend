import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class LoginRequestDto {
    @ApiProperty({ description: 'Email address', example: 'name@company.com' })
    @IsEmail()
    @IsNotEmpty()
    email: string;

    @ApiProperty({ description: 'Password', example: 'secure_password' })
    @IsString()
    @IsNotEmpty()
    password: string;
}

export class LoginResponseDto {
    @ApiProperty({ description: 'JWT Token' })
    token: string;

    @ApiProperty({ description: 'Success message' })
    message: string;
}
