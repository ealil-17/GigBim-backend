import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, ExtractJwt } from 'passport-jwt';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
	private prisma = new PrismaClient();

	constructor() {
		super({
			jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
			ignoreExpiration: false,
			secretOrKey: process.env.JWT_SECRET || 'change-me',
		});
	}

	async validate(payload: any) {
		if (!payload || !payload.sub) {
			throw new UnauthorizedException();
		}
		const user = await this.prisma.user.findUnique({ where: { id: payload.sub } });
		if (!user) {
			throw new UnauthorizedException();
		}
		return user;
	}
}
