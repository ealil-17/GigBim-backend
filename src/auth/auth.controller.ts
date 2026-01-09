import { Controller, Get, Req, UseGuards, Post, Body } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiOkResponse, ApiBody, ApiTags, ApiOperation, ApiSecurity, ApiExcludeEndpoint } from '@nestjs/swagger';
import { AndroidTokenResponseDto, GoogleCallbackResponseDto } from './dto/swagger/google-callback';
import { AndroidTokenDto } from './dto/authenticate-android';
import { ValidateTokenRequestDto, ValidateTokenResponseDto } from './dto/validate-token.dto';
import { DevLoginRequestDto, DevLoginResponseDto } from './dto/dev-login.dto';
import { SignupRequestDto, SignupResponseDto } from './dto/signup.dto';
import { LoginRequestDto, LoginResponseDto } from './dto/login.dto';
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
		console.log("Result: ", result);
		return result;
	}

	@Post('validate')
	@Public()
	@ApiOperation({
		summary: 'Validate JWT Token',
		description: 'Checks if the token is valid and returns trial status'
	})
	@ApiBody({ type: ValidateTokenRequestDto })
	@ApiOkResponse({ type: ValidateTokenResponseDto })
	async validateToken(@Body() dto: ValidateTokenRequestDto) {
		return this.authService.validateToken(dto);
	}

	@Post('dev-login')
	@Public()
	@ApiOperation({
		summary: 'Dev Login',
		description: 'Login with just an email for development'
	})
	@ApiBody({ type: DevLoginRequestDto })
	@ApiOkResponse({ type: DevLoginResponseDto })
	async devLogin(@Body() dto: DevLoginRequestDto) {
		return this.authService.devLogin(dto);
	}

	@Post('signup')
	@Public()
	@ApiOperation({
		summary: 'User Signup',
		description: 'Create a new user account'
	})
	@ApiBody({ type: SignupRequestDto })
	@ApiOkResponse({ type: SignupResponseDto })
	async signup(@Body() dto: SignupRequestDto) {
		return this.authService.signup(dto);
	}

	@Post('login')
	@Public()
	@ApiOperation({
		summary: 'User Login',
		description: 'Login with email and password'
	})
	@ApiBody({ type: LoginRequestDto })
	@ApiOkResponse({ type: LoginResponseDto })
	async login(@Body() dto: LoginRequestDto) {
		return this.authService.login(dto);
	}
}
