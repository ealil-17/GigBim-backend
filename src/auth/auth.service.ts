import { Injectable, InternalServerErrorException, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaClient } from '@prisma/client';
// New import
import { OAuth2Client } from 'google-auth-library';

@Injectable()
export class AuthService {
	private prisma = new PrismaClient();

	constructor(private readonly jwtService: JwtService) {}

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

	// New: verify Google idToken coming from Android client and return { user, token }
	async validateIdToken(idToken: string) {
		if (!idToken) {
			throw new UnauthorizedException('Missing idToken');
		}

		const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);
		let ticket;
		try {
			ticket = await client.verifyIdToken({
				idToken,
				audience: process.env.GOOGLE_CLIENT_ID,
			});
		} catch (err) {
			throw new UnauthorizedException('Invalid Google idToken');
		}

		const payload = ticket.getPayload();
		if (!payload || !payload.email) {
			throw new UnauthorizedException('Invalid token payload');
		}

		// build a profile-like object that validateOAuthLogin expects
		const profileLike = {
			emails: [{ value: payload.email }],
			displayName: payload.name || payload.email.split('@')[0],
			photos: payload.picture ? [{ value: payload.picture }] : [],
		};

		// reuse existing logic to find-or-create user and issue jwt
		return this.validateOAuthLogin(profileLike);
	}
}
