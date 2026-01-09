import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator';

export class SignupRequestDto {
    @ApiProperty({ description: 'Username', example: 'johndoe' })
    @IsString()
    @IsNotEmpty()
    username: string;

    @ApiProperty({ description: 'Email address', example: 'name@company.com' })
    @IsEmail()
    @IsNotEmpty()
    email: string;

    @ApiProperty({ description: 'Password', example: 'secure_password' })
    @IsString()
    @IsNotEmpty()
    @MinLength(6)
    password: string;
}

export class SignupResponseDto {
    @ApiProperty({ description: 'Success message' })
    message: string;
}
