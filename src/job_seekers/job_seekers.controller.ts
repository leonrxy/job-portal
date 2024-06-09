import { Controller, Get, Post, Body, Param, Delete, Query, Put } from '@nestjs/common';
import { JobSeekersService } from './job_seekers.service';
import { CreateJobSeekerDto } from './dto/create-job_seeker.dto';
import { UpdateJobSeekerDto } from './dto/update-job_seeker.dto';
import { ApiOperation, ApiQuery, ApiTags } from '@nestjs/swagger';

@ApiTags('job-seekers')
@Controller('job-seekers')
export class JobSeekersController {
  constructor(private readonly jobSeekersService: JobSeekersService) { }

  @Post()
  @ApiOperation({ summary: 'Create a job seeker' })
  create(@Body() createJobSeekerDto: CreateJobSeekerDto) {
    return this.jobSeekersService.create(createJobSeekerDto);
  }

  @Get()
  @ApiOperation({ summary: 'List all job seekers' })
  @ApiQuery({ name: 'page', required: false, type: Number, example: 1, description: 'Page number' })
  @ApiQuery({ name: 'pageSize', required: false, type: Number, example: 10, description: 'Number of items per page' })
  @ApiQuery({ name: 'search', required: false, type: String, example: 'job', description: 'Search term' })
  @ApiQuery({ name: 'sortBy', required: false, type: String, example: 'user_id', description: 'Field to sort by' })
  @ApiQuery({ name: 'sortOrder', required: false, enum: ['asc', 'desc'], example: 'asc', description: 'Sort order' })
  findAll(
    @Query('page') page?: number,
    @Query('pageSize') pageSize?: number,
    @Query('search') search?: string,
    @Query('sortBy') sortBy?: string,
    @Query('sortOrder') sortOrder?: 'asc' | 'desc'
  ) {
    return this.jobSeekersService.findAll({ page, pageSize, search, sortBy, sortOrder });
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a job seeker' })
  findOne(@Param('id') id: string) {
    return this.jobSeekersService.findOne(id);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update a job seeker' })
  update(@Param('id') id: string, @Body() updateJobSeekerDto: UpdateJobSeekerDto) {
    return this.jobSeekersService.update(id, updateJobSeekerDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a job seeker' })
  remove(@Param('id') id: string) {
    return this.jobSeekersService.remove(id);
  }
}
