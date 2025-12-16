import { Injectable, UnauthorizedException, ConflictException, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import * as bcrypt from 'bcrypt';
import * as crypto from 'crypto';

@Injectable()
export class AuthService {
    constructor(private prisma: PrismaService) { }

    async validateUser(email: string, password: string) {
        const user = await this.prisma.user.findUnique({
            where: { email },
            include: { blog: true },
        });

        if (!user) {
            throw new UnauthorizedException('Invalid credentials');
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);

        if (!isPasswordValid) {
            throw new UnauthorizedException('Invalid credentials');
        }

        const { password: _, ...result } = user;
        return result;
    }

    async register(email: string, password: string, firstName?: string, lastName?: string) {
        // Check if user already exists
        const existingUser = await this.prisma.user.findUnique({
            where: { email },
        });

        if (existingUser) {
            throw new ConflictException('User with this email already exists');
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 12);

        // Create user
        const user = await this.prisma.user.create({
            data: {
                email,
                password: hashedPassword,
                firstName,
                lastName,
                onboardingCompleted: false,
            },
        });

        const { password: _, ...result } = user;
        return result;
    }

    async getUserById(id: string) {
        const user = await this.prisma.user.findUnique({
            where: { id },
            select: {
                id: true,
                email: true,
                firstName: true,
                lastName: true,
                displayName: true,
                bio: true,
                avatarUrl: true,
                timezone: true,
                language: true,
                role: true,
                onboardingCompleted: true,
                createdAt: true,
            },
        });

        return user;
    }

    async forgotPassword(email: string) {
        const user = await this.prisma.user.findUnique({
            where: { email },
        });

        if (!user) {
            // Don't reveal if user exists or not for security
            return { message: 'If an account with that email exists, a password reset link has been sent.' };
        }

        // Generate reset token
        const token = crypto.randomBytes(32).toString('hex');
        const expiresAt = new Date(Date.now() + 60 * 60 * 1000); // 1 hour from now

        // Delete any existing reset tokens for this user
        await this.prisma.passwordReset.deleteMany({
            where: { userId: user.id },
        });

        // Create new reset token
        await this.prisma.passwordReset.create({
            data: {
                token,
                expiresAt,
                userId: user.id,
            },
        });

        // In production, send email with reset link
        // For now, we'll return the token (in production, only return success message)
        const resetUrl = `${process.env.FRONTEND_URL || 'http://localhost:3000'}/reset-password?token=${token}`;

        console.log(`Password reset link: ${resetUrl}`); // Remove in production

        return {
            message: 'If an account with that email exists, a password reset link has been sent.',
            // Remove in production - only for development
            ...(process.env.NODE_ENV === 'development' && { resetUrl, token }),
        };
    }

    async resetPassword(token: string, newPassword: string) {
        // Find the reset token
        const passwordReset = await this.prisma.passwordReset.findUnique({
            where: { token },
            include: { user: true },
        });

        if (!passwordReset) {
            throw new BadRequestException('Invalid or expired reset token');
        }

        // Check if token is expired
        if (passwordReset.expiresAt < new Date()) {
            throw new BadRequestException('Reset token has expired');
        }

        // Check if token was already used
        if (passwordReset.usedAt) {
            throw new BadRequestException('Reset token has already been used');
        }

        // Validate password
        if (newPassword.length < 8) {
            throw new BadRequestException('Password must be at least 8 characters');
        }

        // Hash new password
        const hashedPassword = await bcrypt.hash(newPassword, 12);

        // Update user password and mark token as used
        await this.prisma.$transaction([
            this.prisma.user.update({
                where: { id: passwordReset.userId },
                data: { password: hashedPassword },
            }),
            this.prisma.passwordReset.update({
                where: { id: passwordReset.id },
                data: { usedAt: new Date() },
            }),
        ]);

        return { message: 'Password has been reset successfully' };
    }

    async checkOnboardingStatus(userId: string) {
        const user = await this.prisma.user.findUnique({
            where: { id: userId },
            select: {
                onboardingCompleted: true,
                blog: {
                    select: {
                        subdomain: true,
                        name: true,
                    },
                },
            },
        });

        if (!user) {
            throw new NotFoundException('User not found');
        }

        return {
            hasCompletedOnboarding: user.onboardingCompleted,
            subdomain: user.blog?.subdomain,
            blogName: user.blog?.name,
        };
    }
}
