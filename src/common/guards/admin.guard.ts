import { Injectable, ForbiddenException } from '@nestjs/common';
import { CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { IS_ADMIN_KEY } from '../decorators/admin.decorator';
import { IS_PUBLIC_KEY } from '../decorators/public.decorator';

@Injectable()
export class AdminGuard implements CanActivate {
	constructor(private reflector: Reflector) {}

	canActivate(context: ExecutionContext): boolean {
		// If route is public, allow
		const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
			context.getHandler(),
			context.getClass(),
		]);
		if (isPublic) return true;

		// If @Admin not present, allow (normal JWT guard will handle auth)
		const requiresAdmin = this.reflector.getAllAndOverride<boolean>(IS_ADMIN_KEY, [
			context.getHandler(),
			context.getClass(),
		]);
		if (!requiresAdmin) return true;

		const req = context.switchToHttp().getRequest();
		const user = req.user;
		if (!user || user.role !== 'admin') {
			throw new ForbiddenException('Admin privileges required');
		}
		return true;
	}
}
