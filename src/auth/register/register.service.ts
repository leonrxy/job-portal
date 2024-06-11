import { BadRequestException, ConflictException, HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { RegisterJobSeekerDto } from './dto/register-job-seeker.dto';
import { PrismaService } from 'prisma/prisma.service';
import * as nodemailer from 'nodemailer';
import * as bcrypt from 'bcryptjs';
import * as crypto from 'crypto';
import { validate } from 'class-validator';
import { otpEmailTemplate } from './email-templates/otp-email-template';
import { RegisterCompanyDto } from './dto/register-company.dto';
import { RegisterUniversityDto } from './dto/register-university.dto';

@Injectable()
export class RegisterService {
  constructor(
    private prisma: PrismaService,) { }

  async registerJobSeeker(registerJobSeekerDto: RegisterJobSeekerDto): Promise<any> {
    const errors = await validate(registerJobSeekerDto);
    if (errors.length > 0) {
      throw new BadRequestException(errors);
    }

    // Check if email is already registered
    const existingUser = await this.prisma.job_seekers.findUnique({
      where: { email: registerJobSeekerDto.email }
    });

    if (existingUser) {
      if (existingUser.verified === 'true') {
        throw new ConflictException('Email is already registered and verified. Please login instead.');
      }
    }

    const { email, full_name, password } = registerJobSeekerDto;
    const hashedPassword = await bcrypt.hash(password, 10);
    const otp = crypto.randomInt(100000, 999999).toString(); // Generate a 6-digit OTP
    const otpHash = crypto.createHash('sha256').update(otp).digest('hex'); // Optionally hash OTP for security reasons

    if (existingUser) {
      if (existingUser.verified === 'false') {
        await this.prisma.job_seekers.update({
          where: { job_seeker_id: existingUser.job_seeker_id },
          data: {
            email,
            full_name,
            password: hashedPassword,
            otp: otpHash,
            otpExpires: new Date(Date.now() + 15 * 60 * 1000), // OTP expires in 15 minutes
          },
        });
      }
    } else {
      await this.prisma.job_seekers.create({
        data: {
          email,
          full_name,
          password: hashedPassword,
          otp: otpHash,
          otpExpires: new Date(Date.now() + 15 * 60 * 1000), // OTP expires in 15 minutes
        },
      });
    }

    await this.sendOtpEmail(email, otp);

    return {
      status: 'success',
      message: 'OTP sent successfully.Please check your email for the OTP code.',
    };
  }

  async registerCompany(registerCompanyDto: RegisterCompanyDto): Promise<any> {
    const errors = await validate(registerCompanyDto);
    if (errors.length > 0) {
      throw new BadRequestException(errors);
    }

    // Check if email is already registered
    const existingUser = await this.prisma.companies.findUnique({
      where: { email: registerCompanyDto.email }
    });

    if (existingUser) {
      if (existingUser.verified === 'true') {
        throw new ConflictException('Email is already registered and verified. Please login instead.');
      }
    }

    const { company_name, phone_number, email, password } = registerCompanyDto;
    const hashedPassword = await bcrypt.hash(password, 10);
    const otp = crypto.randomInt(100000, 999999).toString(); // Generate a 6-digit OTP
    const otpHash = crypto.createHash('sha256').update(otp).digest('hex'); // Optionally hash OTP for security reasons

    if (existingUser) {
      if (existingUser.verified === 'false') {
        await this.prisma.companies.update({
          where: { company_id: existingUser.company_id },
          data: {
            email,
            company_name,
            password: hashedPassword,
            otp: otpHash,
            otpExpires: new Date(Date.now() + 15 * 60 * 1000), // OTP expires in 15 minutes
          },
        });
      }
    } else {
      await this.prisma.companies.create({
        data: {
          email,
          company_name,
          phone_number,
          password: hashedPassword,
          otp: otpHash,
          otpExpires: new Date(Date.now() + 15 * 60 * 1000), // OTP expires in 15 minutes
        },
      });
    }

    await this.sendOtpEmail(email, otp);

    return {
      status: 'success',
      message: 'OTP sent successfully.Please check your email for the OTP code.',
    };
  }

  async registerUniversity(registerUniversityDto: RegisterUniversityDto): Promise<any> {
    const errors = await validate(registerUniversityDto);
    if (errors.length > 0) {
      throw new BadRequestException(errors);
    }

    // Check if email is already registered
    const existingUser = await this.prisma.universities.findUnique({
      where: { email: registerUniversityDto.email }
    });

    if (existingUser) {
      if (existingUser.verified === 'true') {
        throw new ConflictException('Email is already registered and verified. Please login instead.');
      }
    }

    const { university_name, email, password } = registerUniversityDto;
    const hashedPassword = await bcrypt.hash(password, 10);
    const otp = crypto.randomInt(100000, 999999).toString(); // Generate a 6-digit OTP
    const otpHash = crypto.createHash('sha256').update(otp).digest('hex'); // Optionally hash OTP for security reasons

    if (existingUser) {
      if (existingUser.verified === 'false') {
        await this.prisma.universities.update({
          where: { university_id: existingUser.university_id },
          data: {
            email,
            university_name,
            password: hashedPassword,
            otp: otpHash,
            otpExpires: new Date(Date.now() + 15 * 60 * 1000), // OTP expires in 15 minutes
          },
        });
      }
    } else {
      await this.prisma.universities.create({
        data: {
          email,
          university_name,
          password: hashedPassword,
          otp: otpHash,
          otpExpires: new Date(Date.now() + 15 * 60 * 1000), // OTP expires in 15 minutes
        },
      });
    }

    await this.sendOtpEmail(email, otp);

    return {
      status: 'success',
      message: 'OTP sent successfully.Please check your email for the OTP code.',
    };
  }

  async sendOtpEmail(email: string, otp: string) {
    const transporter = nodemailer.createTransport({
      host: process.env.EMAIL_HOST,
      port: parseInt(process.env.EMAIL_PORT),
      secure: false, // true for 465, false for other ports
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
      tls: {
        rejectUnauthorized: false
      }
    });

    const htmlContent = otpEmailTemplate(otp, email);

    await transporter.sendMail({
      from: '"Digitefa" <no-reply@zenify.my.id>',
      to: email,
      subject: 'Digitefa OTP Verification Code',
      text: `Your OTP code is ${otp}`,
      html: htmlContent,
    });
  }

  async verifyOtp(email: string, otp: string): Promise<any> {
    const otpHash = crypto.createHash('sha256').update(otp).digest('hex'); // Hash the OTP input
    const user = await this.prisma.job_seekers.findUnique({
      where: { email },
    });

    if (!user) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }

    if (user.otp !== otpHash || new Date() > user.otpExpires) {
      throw new HttpException('Invalid or expired OTP', HttpStatus.BAD_REQUEST);
    }

    // Update user verification
    await this.prisma.job_seekers.update({
      where: { email },
      data: {
        verified: "true",
        otp: null,
        otpExpires: null,
      },
    });

    return {
      status: 'success',
      message: 'Email verified successfully. Please login to continue.',
    };
  }
}
