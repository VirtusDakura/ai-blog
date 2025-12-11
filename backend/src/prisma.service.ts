import { Injectable, OnModuleInit, OnModuleDestroy, Logger } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { Pool } from 'pg';
import { PrismaPg } from '@prisma/adapter-pg';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
    private readonly logger = new Logger(PrismaService.name);
    private pool: Pool;

    constructor() {
        const connectionString = process.env.DATABASE_URL as string;
        const pool = new Pool({ connectionString });
        const adapter = new PrismaPg(pool);

        super({
            adapter,
            log: process.env.NODE_ENV === 'development'
                ? ['warn', 'error']
                : ['error'],
        });

        this.pool = pool;
    }

    async onModuleInit() {
        try {
            await this.$connect();
            this.logger.log('Successfully connected to database');
        } catch (error) {
            this.logger.error('Failed to connect to database', error);
            throw error;
        }
    }

    async onModuleDestroy() {
        await this.$disconnect();
        await this.pool.end();
        this.logger.log('Disconnected from database');
    }
}
