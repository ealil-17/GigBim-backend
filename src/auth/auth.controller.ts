import { Controller, Get, Req, UseGuards, Post, Body } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiOkResponse, ApiBody, ApiTags, ApiOperation, ApiSecurity, ApiExcludeEndpoint } from '@nestjs/swagger';
import { AndroidTokenResponseDto, GoogleCallbackResponseDto } from './dto/swagger/google-callback';
import { AndroidTokenDto } from './dto/authenticate-android';
import { AuthService } from './auth.service';
import { Public } from '../common/decorators/public.decorator';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) { }

	@Get('google')
	@Public()
	@UseGuards(AuthGuard('google'))
	@ApiOperation({ 
		summary: 'Google OAuth Authentication',
		description: 'Redirects to Google for authentication' 
	})
	async googleAuth() {
		// Passport will redirect
	}

	@Get('google/callback')
	@Public()
	@UseGuards(AuthGuard('google'))
	@ApiOperation({ 
		summary: 'Google OAuth Callback',
		description: 'Callback endpoint for Google OAuth' 
	})
	@ApiExcludeEndpoint() // Hide from Swagger as it's redirected to by Google
	@ApiOkResponse({ type: GoogleCallbackResponseDto })
	async googleAuthRedirect(@Req() req: any) {
		// req.user is the object returned from GoogleStrategy.validate -> AuthService.validateOAuthLogin
		// It contains { user, token }
		const result = req.user;
		// Return JSON; you can also redirect to frontend with token as query param if desired.
        console.log("Result: ",result);
		return result;
	}

	@Post('google/token')
	@Public()
	@ApiOperation({ 
		summary: 'Authenticate with Google ID Token',
		description: 'For mobile clients to authenticate using Google ID token' 
	})
	@ApiBody({ type: AndroidTokenDto })
	@ApiOkResponse({ type: GoogleCallbackResponseDto })
	async authenticateAndroid(@Body() body: AndroidTokenDto) {
		const result = await this.authService.validateIdToken(body.idToken);
		return result;
	}

	// Example: admin-only endpoint usage
	// @Get('admin-only')
	// @Admin()
	// someAdminHandler() { ... }
}
