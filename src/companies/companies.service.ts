import { BadRequestException, ConflictException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { CreateCompanyDto } from './dto/create-company.dto';
import { UpdateCompanyDto } from './dto/update-company.dto';
import { PrismaService } from 'prisma/prisma.service';
import { Prisma } from '@prisma/client';
import * as bcrypt from 'bcryptjs';
import { validate } from 'class-validator';

@Injectable()
export class CompaniesService {
  constructor(private prisma: PrismaService) { }
  async create(createCompanyDto: CreateCompanyDto) {
    const errors = await validate(createCompanyDto);
    if (errors.length > 0) {
      throw new BadRequestException(errors);
    }
    //Check Email
    const existingEmail = await this.prisma.companies.findUnique({
      where:
        { email: createCompanyDto.email } as Prisma.companiesWhereUniqueInput
    });

    if (existingEmail) {
      throw new ConflictException('Email is already taken');
    }
    try {
      const { password, ...userData } = createCompanyDto;
      const hashedPassword = await bcrypt.hash(password, 10);

      const newCompany = await this.prisma.companies.create({ data: { ...userData, password: hashedPassword } as Prisma.companiesCreateInput });
      return {
        status: "success",
        message: 'Company created successfully',
        data: newCompany
      };

    } catch (error) {
      console.log(error)
      throw new InternalServerErrorException('Failed to create company');
    }
  }

  async findAll(params: {
    page?: number,
    pageSize?: number,
    search?: string,
    sortBy?: string,
    sortOrder?: 'asc' | 'desc'
  }) {
    const { page = 1, pageSize = 10, search, sortBy = 'updated_at', sortOrder = 'desc' } = params;

    const skip = (page - 1) * pageSize;
    const take = +pageSize;

    try {
      const where = search ? {
        OR: [
          { company_name: { contains: search } },
          { email: { contains: search } },
        ]
      } : {};
      const companies = await this.prisma.companies.findMany({
        where,
        skip,
        take,
        orderBy: {
          [sortBy]: sortOrder
        }
      });
      return {
        status: "success",
        data: companies
      };
    } catch (error) {
      console.log(error)
      throw new InternalServerErrorException('Failed to retrieve companies');
    }
  }

  async findOne(company_id: string) {
    const companies = await this.prisma.companies.findUnique({
      where: { company_id }
    });

    if (!companies) {
      throw new NotFoundException(`Company with ID ${company_id} not found`);
    }
    try {
      return {
        status: "success",
        data: companies
      };
    } catch (error) {
      console.log(error)
      throw new InternalServerErrorException('Failed to retrieve companies');
    }
  }

  async update(company_id: string, updateCompaniesDto: UpdateCompanyDto) {
    const errors = await validate(updateCompaniesDto);
    if (errors.length > 0) {
      throw new BadRequestException(errors);
    }

    const existingCompany = await this.prisma.companies.findUnique({
      where: { company_id }
    });

    if (!existingCompany) {
      throw new NotFoundException(`Company with ID ${company_id} not found`);
    }

    try {
      const updatedCompany = await this.prisma.companies.update({
        where: { company_id },
        data: updateCompaniesDto
      });

      return {
        status: "success",
        message: 'Company updated successfully',
        data: updatedCompany
      };

    } catch (error) {
      throw new InternalServerErrorException('Failed to update company');
    }
  }

  async remove(company_id: string) {
    const existingCompany = await this.prisma.companies.findUnique({
      where: { company_id }
    });

    if (!existingCompany) {
      throw new NotFoundException(`Company with ID ${company_id} not found`);
    }
    try {
      await this.prisma.companies.delete({
        where: { company_id }
      });

      return {
        status: "success",
        message: 'User removed successfully'
      };

    } catch (error) {
      throw new InternalServerErrorException('Failed to remove company');
    }
  }
}
