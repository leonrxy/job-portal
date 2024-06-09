import { BadRequestException, ConflictException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { CreateJobSeekerDto } from './dto/create-job_seeker.dto';
import { UpdateJobSeekerDto } from './dto/update-job_seeker.dto';
import { PrismaService } from 'prisma/prisma.service';
import { Prisma } from '@prisma/client';
import * as bcrypt from 'bcryptjs';
import { validate } from 'class-validator';

@Injectable()
export class JobSeekersService {
  constructor(private prisma: PrismaService) { }
  async create(createJobSeekerDto: CreateJobSeekerDto) {
    const errors = await validate(createJobSeekerDto);
    if (errors.length > 0) {
      throw new BadRequestException(errors);
    }
    //Check Email
    const existingEmail = await this.prisma.job_seekers.findUnique({
      where:
        { email: createJobSeekerDto.email } as Prisma.job_seekersWhereUniqueInput
    });

    if (existingEmail) {
      throw new ConflictException('Email is already taken');
    }
    try {
      const { password, ...userData } = createJobSeekerDto;
      const hashedPassword = await bcrypt.hash(password, 10);

      const newUser = await this.prisma.job_seekers.create({ data: { ...userData, password: hashedPassword } as Prisma.job_seekersCreateInput });
      return {
        status: "success",
        message: 'User created successfully',
        data: newUser
      };

    } catch (error) {
      throw new InternalServerErrorException('Failed to create user');
    }
  }

  async findAll(params: {
    page?: number,
    pageSize?: number,
    search?: string,
    sortBy?: string,
    sortOrder?: 'asc' | 'desc'
  }) {
    const { page = 1, pageSize = 10, search, sortBy = 'updated_at', sortOrder = 'asc' } = params;

    const skip = (page - 1) * pageSize;
    const take = +pageSize;


    try {
      const where = search ? {
        OR: [
          { name: { contains: search } },
          { email: { contains: search } },
        ]
      } : {};
      const jobSeekers = await this.prisma.job_seekers.findMany({
        where,
        skip,
        take,
        orderBy: {
          [sortBy]: sortOrder
        }
      });
      return {
        status: "success",
        data: jobSeekers
      };
    } catch (error) {
      console.log(error)
      throw new InternalServerErrorException('Failed to retrieve job seekers');
    }
  }

  async findOne(job_seeker_id: string) {
    const jobSeeker = await this.prisma.job_seekers.findUnique({
      where: { job_seeker_id }
    });

    if (!jobSeeker) {
      throw new NotFoundException(`Job Seeker with ID ${job_seeker_id} not found`);
    }
    try {
      return {
        status: "success",
        data: jobSeeker
      };
    } catch (error) {
      console.log(error)
      throw new InternalServerErrorException('Failed to retrieve job seeker');
    }
  }

  async update(job_seeker_id: string, updateJobSeekerDto: UpdateJobSeekerDto) {
    const errors = await validate(updateJobSeekerDto);
    if (errors.length > 0) {
      throw new BadRequestException(errors);
    }

    const existingJobSeeker = await this.prisma.job_seekers.findUnique({
      where: { job_seeker_id }
    });

    if (!existingJobSeeker) {
      throw new NotFoundException(`Job Seeker with ID ${job_seeker_id} not found`);
    }

    try {
      const updatedJobSeeker = await this.prisma.job_seekers.update({
        where: { job_seeker_id },
        data: updateJobSeekerDto
      });

      return {
        status: "success",
        message: 'User updated successfully',
        data: updatedJobSeeker
      };

    } catch (error) {
      throw new InternalServerErrorException('Failed to update user');
    }
  }

  async remove(job_seeker_id: string) {
    const existingJobSeeker = await this.prisma.job_seekers.findUnique({
      where: { job_seeker_id }
    });

    if (!existingJobSeeker) {
      throw new NotFoundException(`Job Seeker with ID ${job_seeker_id} not found`);
    }
    try {
      await this.prisma.job_seekers.delete({
        where: { job_seeker_id }
      });

      return {
        status: "success",
        message: 'User removed successfully'
      };

    } catch (error) {
      throw new InternalServerErrorException('Failed to remove user');
    }
  }
}
