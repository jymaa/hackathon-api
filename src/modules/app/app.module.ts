import { Module } from '@nestjs/common';
import { MiddlewareConsumer } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { UserModule } from '../user/user.module';
import { AuthModule } from '../auth/auth.module';
import { PrismaModule } from '../prisma/prisma.module';
import { GLOBAL_CONFIG } from '../../configs/global.config';
import { LoggerModule } from '../logger/logger.module';
import { AppService } from './app.service';
import { AppController } from './app.controller';
import { LoggerMiddleware } from '../../middlewares/logger.middleware';
import { ScheduleModule } from '@nestjs/schedule';
import { CronService } from '../cron/cron.service';

@Module({
  imports: [
    ScheduleModule.forRoot(),
    ConfigModule.forRoot({ isGlobal: true, load: [() => GLOBAL_CONFIG] }),
    LoggerModule,
    PrismaModule,
    AuthModule,
    UserModule,
  ],
  controllers: [AppController],
  providers: [AppService, CronService],
  exports: [],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleware).forRoutes('*');
  }
}
