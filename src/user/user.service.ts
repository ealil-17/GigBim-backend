import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class UserService {
	constructor(private readonly prisma: PrismaService) {}

	async findByUsername(username: string) {
		return this.prisma.user.findUnique({
			where: { username },
			select: {
				id: true,
				email: true,
				username: true,
				name: true,
				avatarUrl: true,
				bio: true,
				createdAt: true,
				updatedAt: true,
			},
		});
	}
}
