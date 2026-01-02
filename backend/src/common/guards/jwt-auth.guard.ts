import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ConfigService } from '@nestjs/config';
import { IS_PUBLIC_KEY } from '../decorators/public.decorator';
import * as jwt from 'jsonwebtoken';

export interface JwtPayload {
  sub?: string;
  email?: string;
  [key: string]: unknown;
}

@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private configService: ConfigService,
  ) {}

  canActivate(context: ExecutionContext): boolean {
    // Check if route is marked as public
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (isPublic) {
      return true;
    }

    const request = context.switchToHttp().getRequest<{
      headers: { authorization?: string };
      user?: JwtPayload;
    }>();
    const authHeader = request.headers.authorization;

    if (!authHeader) {
      throw new UnauthorizedException('No authorization header provided');
    }

    const [type, token] = authHeader.split(' ');

    if (type !== 'Bearer' || !token) {
      throw new UnauthorizedException('Invalid authorization header format');
    }

    try {
      const secret =
        this.configService.get<string>('NEXTAUTH_SECRET') ||
        this.configService.get<string>('JWT_SECRET');

      if (!secret) {
        // Determine if we should fail open or closed if secret is missing?
        // Closed is safer.
        throw new UnauthorizedException('JWT secret not configured');
      }
      // Note: NextAuth JWTs might need to be decoded differently depending on encryption vs signing
      // But usually for passing to backend, it's a signed JWT.
      const decoded = jwt.verify(token, secret) as JwtPayload;

      // Debug logging (can be removed in production)
      console.log('JWT decoded successfully:', {
        sub: decoded.sub,
        email: decoded.email,
        hasUser: !!decoded,
      });

      // Attach user info to request
      request.user = decoded;
      return true;
    } catch (error) {
      console.error('JWT verification failed:', (error as Error).message);
      throw new UnauthorizedException('Invalid or expired token');
    }
  }
}
