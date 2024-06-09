import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from '../prisma/prisma.module';
import { JobSeekersModule } from './job_seekers/job_seekers.module';
import { AuthModule } from './auth/auth.module';
import { LoginModule } from './auth/login/login.module';

@Module({
  imports: [PrismaModule, AuthModule, LoginModule, JobSeekersModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
