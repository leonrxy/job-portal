import { HttpException, HttpStatus, Injectable, NotFoundException } from '@nestjs/common';
import * as bcrypt from 'bcryptjs';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from 'prisma/prisma.service';
import { LoginJobSeekerDto } from './dto/loginJobSeeker.dto';
import { LoginUniversityDto } from './dto/loginUniversity.dto';
import { LoginCompanyDto } from './dto/loginCompany.dto';
import { LoginAdminDto } from './dto/loginAdmin.dto';

@Injectable()
export class LoginService {
    constructor(
        private prisma: PrismaService,
        private jwtService: JwtService,) { }

    async validateJobSeeker(loginJobSeekerDto: LoginJobSeekerDto): Promise<any> {
        const user = await this.prisma.job_seekers.findUnique({ where: { email: loginJobSeekerDto.email } });
        if (!user) {
            throw new NotFoundException('User not found. Please register to create an account.');
        }
        if (!(await bcrypt.compareSync(loginJobSeekerDto.password, user.password))) {
            throw new HttpException({ status: "failed", message: 'Invalid Password' }, HttpStatus.UNAUTHORIZED);
        }
        const job_seeker = { ...user, role: 'job_seeker' }
        return job_seeker;
    }

    async validateUniversity(loginUniversityDto: LoginUniversityDto): Promise<any> {
        const user = await this.prisma.universities.findUnique({ where: { email: loginUniversityDto.email } });
        if (!user) {
            throw new NotFoundException('User not found. Please register to create an account.');
        }
        if (!(await bcrypt.compareSync(loginUniversityDto.password, user.password))) {
            throw new HttpException({ status: "failed", message: 'Invalid Password' }, HttpStatus.UNAUTHORIZED);
        }
        const university = { ...user, role: 'university' }
        return university;
    }

    async validateCompany(loginCompanyDto: LoginCompanyDto): Promise<any> {
        const user = await this.prisma.companies.findUnique({ where: { email: loginCompanyDto.email } });
        if (!user) {
            throw new NotFoundException('User not found. Please register to create an account.');
        }
        if (!(await bcrypt.compareSync(loginCompanyDto.password, user.password))) {
            throw new HttpException({ status: "failed", message: 'Invalid Password' }, HttpStatus.UNAUTHORIZED);
        }
        const company = { ...user, role: 'company' }
        return company;
    }

    async validateSuperadmin(loginAdminDto: LoginAdminDto): Promise<any> {
        const user = await this.prisma.admins.findUnique({ where: { email: loginAdminDto.email } });
        if (!user) {
            throw new HttpException({ status: "failed", message: 'User not found' }, HttpStatus.NOT_FOUND,);
        }
        if (!(await bcrypt.compareSync(loginAdminDto.password, user.password))) {
            throw new HttpException({ status: "failed", message: 'Invalid Password' }, HttpStatus.UNAUTHORIZED);
        }
        const superadmin = { ...user, role: user.role }
        return superadmin;
    }

    async login(user: any) {
        let payload;
        if (user.role === "job_seeker") {
            payload = { job_seeker_id: user.job_seeker_id, email: user.email, role: user.role };
        } else if (user.role === "university") {
            payload = { university_id: user.university_id, email: user.email, role: user.role };
        } else if (user.role === "company") {
            payload = { company_id: user.company_id, email: user.email, role: user.role };
        } else if (user.role === "superadmin") {
            payload = { admin_id: user.admin_id, email: user.email, role: user.role };
        }
        const token = await this.jwtService.signAsync(payload);
        const detailUser = Object.fromEntries(
            Object.entries(user).filter(([key]) => !['otp', 'otpExpires', 'password', 'updated_at', 'created_at'].includes(key))
        );
        return {
            status: "success",
            message: 'Login Successful',
            data: {
                token: token,
                user: detailUser
            }
        };
    }

    async getUser(user: any) {
        console.log(user)
        let users;
        if (user.role === 'job_seeker') {
            users = await this.prisma.job_seekers.findUnique({ where: { job_seeker_id: user.job_seeker_id } });
            users = { ...users, role: 'job_seeker' }
        } else if (user.role === 'university') {
            users = await this.prisma.universities.findUnique({ where: { university_id: user.university_id } });
            users = { ...users, role: 'university' }
        } else if (user.role === 'company') {
            users = await this.prisma.companies.findUnique({ where: { company_id: user.company_id } });
            users = { ...users, role: 'company' }
        } else if (user.role === 'superadmin') {
            users = await this.prisma.admins.findUnique({ where: { admin_id: user.admin_id } });
            users = { ...users, role: 'superadmin' }
        }
        if (!users) {
            throw new HttpException({ status: "failed", message: 'Token not found!' }, HttpStatus.NOT_FOUND);
        }
        const detailUser = Object.fromEntries(
            Object.entries(users).filter(([key]) => !['password', 'updated_at', 'created_at'].includes(key))
        );
        return {
            status: "success",
            message: 'Login Successful',
            data: {
                user: detailUser
            }
        };
    }
}
