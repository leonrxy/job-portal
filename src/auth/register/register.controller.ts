import { Controller, Post, Body, HttpCode, HttpStatus } from '@nestjs/common';
import { RegisterService } from './register.service';
import { RegisterJobSeekerDto } from './dto/register-job-seeker.dto';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { VerifyOTPDto } from './dto/verify-otp.dto';


@ApiTags('auth/register')
@Controller('auth/register')
export class RegisterController {
  constructor(private readonly registerService: RegisterService) { }

  @Post('job-seeker')
  @ApiOperation({ summary: 'Register a job seeker' })
  create(@Body() registerJobSeekerDto: RegisterJobSeekerDto) {
    return this.registerService.registerJobSeeker(registerJobSeekerDto);
  }

  @Post('verify-otp')
  @ApiOperation({ summary: 'Verify OTP' })
  @HttpCode(HttpStatus.OK)
  async verifyOtp(@Body() verifyOtpDto: VerifyOTPDto): Promise<string> {
    return this.registerService.verifyOtp(verifyOtpDto.email, verifyOtpDto.otp);
  }
}
