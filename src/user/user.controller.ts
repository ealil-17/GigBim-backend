import { Controller, Get, Param, NotFoundException } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiOkResponse, ApiNotFoundResponse, ApiBearerAuth } from '@nestjs/swagger';
import { UserService } from './user.service';
import { GetByUsernameResponseDto } from './dto';
@ApiTags('User')
@ApiBearerAuth('JWT')
@Controller('user')
export class UserController {
    constructor(private readonly userService: UserService) { }

    @Get(':username')
    @ApiOperation({ summary: 'Get user by username' })
    @ApiOkResponse({ description: 'User found', type: GetByUsernameResponseDto })
    @ApiNotFoundResponse({ description: 'User not found' })
    async getByUsername(@Param('username') username: string) {
        const user = await this.userService.findByUsername(username);
        if (!user) throw new NotFoundException('User not found');
        return user;
    }
}
