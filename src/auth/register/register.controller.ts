import { Controller, Post, Body, HttpCode, HttpStatus } from '@nestjs/common';
import { RegisterService } from './register.service';
import { RegisterJobSeekerDto } from './dto/register-job-seeker.dto';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { VerifyOTPDto } from './dto/verify-otp.dto';
import { RegisterUniversityDto } from './dto/register-university.dto';
import { RegisterCompanyDto } from './dto/register-company.dto';


@ApiTags('auth/register')
@Controller('auth/register')
export class RegisterController {
  constructor(private readonly registerService: RegisterService) { }

  @Post('job-seeker')
  @ApiOperation({ summary: 'Register a job seeker' })
  registerJobSeeker(@Body() registerJobSeekerDto: RegisterJobSeekerDto) {
    return this.registerService.registerJobSeeker(registerJobSeekerDto);
  }
  @Post('company')
  @ApiOperation({ summary: 'Register a company' })
  registerCompany(@Body() registerCompanyDto: RegisterCompanyDto) {
    return this.registerService.registerCompany(registerCompanyDto);
  }
  @Post('university')
  @ApiOperation({ summary: 'Register a university' })
  registerUniversity(@Body() registerUniversityDto: RegisterUniversityDto) {
    return this.registerService.registerUniversity(registerUniversityDto);
  }

  @Post('verify-otp')
  @ApiOperation({ summary: 'Verify OTP' })
  @HttpCode(HttpStatus.OK)
  async verifyOtp(@Body() verifyOtpDto: VerifyOTPDto): Promise<string> {
    return this.registerService.verifyOtp(verifyOtpDto.email, verifyOtpDto.otp);
  }
}
