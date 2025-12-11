import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { PrismaService } from '../prisma.service';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';

@Module({
    controllers: [AuthController],
    providers: [AuthService, PrismaService, JwtAuthGuard],
    exports: [AuthService, JwtAuthGuard],
})
export class AuthModule { }
