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
  UseGuards,
  Req
} from '@nestjs/common';
import { Request } from 'express';
import { ProjectNotFoundError, ProjectsService } from './projects.service';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';
import { FindAllParams } from './dto/params/find-all.params';
import { FindOneParams } from './dto/params/find-one.params';
import { JwtAuthGuard } from 'src/auth/guards/jwt.guard';
import { CaslAbilityFactory } from 'src/casl/casl-ability.factory/casl-ability.factory';
import { ProjectPermissionGuard } from './guards/project.permission.guard';
import { RequireAbility } from 'src/casl/decorators/permission.decorator';
import { FindProjectResponse } from './responses/find-one.response';

@UseGuards(JwtAuthGuard, ProjectPermissionGuard)
@Controller('')
export class ProjectsController {
  constructor(
    private readonly projectsService: ProjectsService,
    private readonly abilityFactory: CaslAbilityFactory
  ) {}

  @Post('/projects')
  async create(@Body() createProjectDto: CreateProjectDto, @Req() req: Request): Promise<FindProjectResponse> {
    const created = await this.projectsService.create(createProjectDto, req.user);
    return new FindProjectResponse(created);
  }

  @Get('/projects')
  async findAll(@Query() params: FindAllParams): Promise<FindProjectResponse[]> {
    return (await this.projectsService.findAll(params)).map(project => new FindProjectResponse(project));
  }

  @RequireAbility("read")
  @Get('/projects/:id')
  async findOne(@Param() params: FindOneParams): Promise<FindProjectResponse> {
    try {
      const found = await this.projectsService.findOne(params);
      return new FindProjectResponse(found);
    } catch (err) {
      if (err instanceof ProjectNotFoundError) {
        throw new NotFoundException('Project not found');
      }
    }
  }

  @Get('/users/:id/projects')
  async findByAuthor(@Param() params: FindOneParams): Promise<FindProjectResponse[]> {
    return (await this.projectsService.findByAuthor(params)).map(project => new FindProjectResponse(project));
  }

  @RequireAbility("update")
  @Patch('/projects/:id')
  async update(
    @Param() params: FindOneParams,
    @Body() updateProjectDto: UpdateProjectDto,
  ): Promise<FindProjectResponse> {
    try {
      const updated = await this.projectsService.update(params, updateProjectDto);
      return new FindProjectResponse(updated);
    } catch(err) {
      if (err instanceof ProjectNotFoundError) {
        throw new NotFoundException('Project not found');
      }
    }
  }

  @RequireAbility("delete")
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
