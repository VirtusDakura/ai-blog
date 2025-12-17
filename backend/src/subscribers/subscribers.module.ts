import { Module } from '@nestjs/common';
import { SubscribersController } from './subscribers.controller';
import { SubscribersService } from './subscribers.service';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
    imports: [PrismaModule],
    controllers: [SubscribersController],
    providers: [SubscribersService],
    exports: [SubscribersService],
})
export class SubscribersModule { }
