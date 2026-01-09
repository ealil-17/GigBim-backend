import { Injectable, InternalServerErrorException, UnauthorizedException, BadRequestException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../prisma/prisma.service';
// New import
import { OAuth2Client } from 'google-auth-library';
import * as bcrypt from 'bcryptjs';
import { ValidateTokenRequestDto, ValidateTokenResponseDto } from './dto/validate-token.dto';
import { DevLoginRequestDto } from './dto/dev-login.dto';
import { SignupRequestDto, SignupResponseDto } from './dto/signup.dto';
import { LoginRequestDto, LoginResponseDto } from './dto/login.dto';

@Injectable()
export class AuthService {
	constructor(
		private readonly jwtService: JwtService,
		private readonly prisma: PrismaService,
	) { }

	// Find existing user by email or create a new one, then return a jwt + user
	async validateOAuthLogin(profile: any) {
		if (!profile || !profile.emails || !profile.emails.length) {
			throw new InternalServerErrorException('No email found from Google OAuth');
		}

		const email: string = profile.emails[0].value;
		let user = await this.prisma.user.findUnique({ where: { email } });

		if (!user) {
			// create username from local-part of email, ensure uniqueness by appending random suffix if needed
			let baseUsername = email.split('@')[0].replace(/[^a-zA-Z0-9._-]/g, '').slice(0, 30) || 'user';
			let username = baseUsername;
			let suffix = 0;
			while (await this.prisma.user.findUnique({ where: { username } })) {
				suffix += 1;
				username = `${baseUsername}${suffix}`;
			}

			user = await this.prisma.user.create({
				data: {
					username,
					name: profile.displayName || username,
					email,
					avatarUrl: profile.photos?.[0]?.value || null,
					bio: null,
				},
			});
		}

		const payload = { sub: user.id, email: user.email, role: user.role };
		const token = this.jwtService.sign(payload);

		return { user, token };
	}

	// Validate token and check trial status
	async validateToken(dto: ValidateTokenRequestDto): Promise<ValidateTokenResponseDto> {
		try {
			const payload = this.jwtService.verify(dto.token);
			if (!payload || !payload.sub) {
				return { isValid: false, isFreeTrial: false, daysRemaining: 0 };
			}

			const user = await this.prisma.user.findUnique({ where: { id: payload.sub } });
			if (!user) {
				return { isValid: false, isFreeTrial: false, daysRemaining: 0 };
			}

			// check 7 days trial
			const now = new Date();
			const created = new Date(user.createdAt);
			const diffTime = Math.abs(now.getTime() - created.getTime());
			const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
			// Note: diffDays=1 means created today/within-24h usually, so we want remaining.
			// Requirement says "check whether the user has the free 7 days trial period still"
			// Let's calculate remaining days.
			const trialPeriodDays = 7;
			// Using logic: difference in milliseconds.
			const diffInMs = now.getTime() - created.getTime();
			const daysPassed = diffInMs / (1000 * 60 * 60 * 24);

			const daysRemaining = Math.max(0, Math.ceil(trialPeriodDays - daysPassed));
			const isFreeTrial = daysPassed < trialPeriodDays;

			return {
				isValid: true,
				isFreeTrial,
				daysRemaining,
				user: {
					id: user.id,
					email: user.email,
					username: user.username,
					name: user.name,
					role: user.role
				},
			};
		} catch (error) {
			return { isValid: false, isFreeTrial: false, daysRemaining: 0 };
		}
	}


	async devLogin(dto: DevLoginRequestDto) {
		const { email } = dto;
		let user = await this.prisma.user.findUnique({ where: { email } });

		if (!user) {
			// create username from local-part of email
			let baseUsername = email.split('@')[0].replace(/[^a-zA-Z0-9._-]/g, '').slice(0, 30) || 'user';
			let username = baseUsername;
			let suffix = 0;
			while (await this.prisma.user.findUnique({ where: { username } })) {
				suffix += 1;
				username = `${baseUsername}${suffix}`;
			}

			user = await this.prisma.user.create({
				data: {
					username,
					name: username,
					email,
					bio: 'Dev User',
				},
			});
		}

		const payload = { sub: user.id, email: user.email, role: user.role };
		const token = this.jwtService.sign(payload);

		return { user, token };
	}

	async signup(dto: SignupRequestDto): Promise<SignupResponseDto> {
		const { username, email, password } = dto;

		const existingUser = await this.prisma.user.findFirst({
			where: {
				OR: [
					{ email },
					{ username }
				]
			}
		});

		if (existingUser) {
			throw new BadRequestException('User with this email or username already exists');
		}

		const hashedPassword = await bcrypt.hash(password, 10);

		await this.prisma.user.create({
			data: {
				username,
				email,
				name: username, // Default name to username since it's required but not in DTO
				password: hashedPassword,
			}
		});

		return { message: 'User created successfully' };
	}

	async login(dto: LoginRequestDto): Promise<LoginResponseDto> {
		const { email, password } = dto;
		const user = await this.prisma.user.findUnique({ where: { email } });

		if (!user) {
			throw new UnauthorizedException('User not found. Please sign up');
		}

		if (null == user.password) {
			throw new UnauthorizedException('Invalid credentials');
		}

		const isPasswordValid = await bcrypt.compare(password, user.password);

		if (!isPasswordValid) {
			throw new UnauthorizedException('Invalid credentials');
		}

		const payload = { sub: user.id, email: user.email, role: user.role };
		const token = this.jwtService.sign(payload);

		return { token, message: 'Login successful' };
	}
}


