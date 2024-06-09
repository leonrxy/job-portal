import { Body, Controller, HttpCode, NotFoundException, Post, UnauthorizedException } from '@nestjs/common';
import { LoginService } from './login.service';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { LoginUniversityDto } from './dto/loginUniversity.dto';
import { LoginJobSeekerDto } from './dto/loginJobSeeker.dto';
import { LoginCompanyDto } from './dto/loginCompany.dto';
import { LoginAdminDto } from './dto/loginAdmin.dto';

@ApiTags('auth/login')
@Controller('auth/login')
export class LoginController {
  constructor(private loginService: LoginService) { }

  @Post('job-seeker')
  @ApiOperation({ summary: 'Login as a job seeker' })
  @HttpCode(200)
  async loginJobSeeker(@Body() loginJobSeekerDto: LoginJobSeekerDto) {
    const user = await this.loginService.validateJobSeeker(loginJobSeekerDto);
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    } else if (user.verified === 'false') {
      throw new NotFoundException('User not found. Please register to create an account.');
    }
    return this.loginService.login(user);
  }

  @Post('university')
  @ApiOperation({ summary: 'Login as a university' })
  @HttpCode(200)
  async loginUniversity(@Body() loginUniversityDto: LoginUniversityDto) {
    const user = await this.loginService.validateUniversity(loginUniversityDto);
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    } else if (user.verified === 'false') {
      throw new NotFoundException('User not found. Please register to create an account.');
    }
    return this.loginService.login(user);
  }

  @Post('company')
  @ApiOperation({ summary: 'Login as a company' })
  @HttpCode(200)
  async loginCompany(@Body() loginCompanyDto: LoginCompanyDto) {
    const user = await this.loginService.validateCompany(loginCompanyDto);
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    } else if (user.verified === 'false') {
      throw new NotFoundException('User not found. Please register to create an account.');
    }
    return this.loginService.login(user);
  }

  @Post('admin')
  @ApiOperation({ summary: 'Login as a superadmin' })
  @HttpCode(200)
  async loginAdmin(@Body() loginAdminDto: LoginAdminDto) {
    const user = await this.loginService.validateSuperadmin(loginAdminDto);
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }
    return this.loginService.login(user);
  }
}