import { ApiProperty } from '@nestjs/swagger';
export class GetByUsernameResponseDto {
    @ApiProperty({ example: 'bc9fea26-68f6-42ae-9826-a7aa05739681' })
    id: string;
    @ApiProperty({ example: 'john.doe@example.com' })
    email: string;
    @ApiProperty({ example: 'johndoe' })
    username: string;
    @ApiProperty({ example: 'John Doe', required: false })
    name?: string;
    @ApiProperty({ example: 'https://example.com/avatar.jpg', required: false })
    avatar?: string;
    @ApiProperty({ example: '2023-10-01T12:34:56.789Z' })
    createdAt: Date;
    @ApiProperty({ example: '2023-10-10T12:34:56.789Z' })
    updatedAt: Date;
}