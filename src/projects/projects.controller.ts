import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  NotFoundException,
} from '@nestjs/common';
import { ProjectNotFoundError, ProjectsService } from './projects.service';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';
import { FindAllParams } from './dto/params/find-all.params';
import { FindOneParams } from './dto/params/find-one.params';

@Controller('')
export class ProjectsController {
  constructor(private readonly projectsService: ProjectsService) {}

  @Post('/projects')
  create(@Body() createProjectDto: CreateProjectDto) {
    return this.projectsService.create(createProjectDto);
  }

  @Get('/projects')
  findAll(@Query() params: FindAllParams) {
    return this.projectsService.findAll(params);
  }

  @Get('/projects/:id')
  findOne(@Param() params: FindOneParams) {
    try {
      return this.projectsService.findOne(params);
    } catch (err) {
      if (err instanceof ProjectNotFoundError) {
        throw new NotFoundException('Project not found');
      }
    }
  }

  @Get('/users/:id/projects')
  findByAuthor(@Param() params: FindOneParams) {
    return this.projectsService.findByAuthor(params);
  }

  @Patch('/projects/:id')
  update(
    @Param() params: FindOneParams,
    @Body() updateProjectDto: UpdateProjectDto,
  ) {
    try {
      return this.projectsService.update(params, updateProjectDto);
    } catch(err) {
      if (err instanceof ProjectNotFoundError) {
        throw new NotFoundException('Project not found');
      }
    }
  }

  @Delete('/projects/:id')
  async remove(@Param() params: FindOneParams) {
    try {
      return this.projectsService.remove(params);
    } catch (err) {
      if (err instanceof ProjectNotFoundError) {
        throw new NotFoundException('Project not found');
      }
    }
  }
}
