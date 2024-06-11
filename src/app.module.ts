import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from '../prisma/prisma.module';
import { JobSeekersModule } from './job_seekers/job_seekers.module';
import { AuthModule } from './auth/auth.module';
import { LoginModule } from './auth/login/login.module';
import { CompaniesModule } from './companies/companies.module';

@Module({
  imports: [PrismaModule, AuthModule, LoginModule, JobSeekersModule, CompaniesModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
