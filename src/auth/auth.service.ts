import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';


@Injectable()
export class AuthService {
    constructor(
        private prisma: PrismaService,) { }

    async getUser(user: any) {
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
            Object.entries(users).filter(([key]) => !['otp', 'otpExpires', 'password', 'updated_at', 'created_at'].includes(key))
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
