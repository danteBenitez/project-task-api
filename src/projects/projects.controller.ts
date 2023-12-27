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

@UseGuards(JwtAuthGuard, ProjectPermissionGuard)
@Controller('')
export class ProjectsController {
  constructor(
    private readonly projectsService: ProjectsService,
    private readonly abilityFactory: CaslAbilityFactory
  ) {}

  @Post('/projects')
  create(@Body() createProjectDto: CreateProjectDto) {
    return this.projectsService.create(createProjectDto);
  }

  @Get('/projects')
  findAll(@Query() params: FindAllParams) {
    return this.projectsService.findAll(params);
  }

  @RequireAbility("read")
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

  @RequireAbility("update")
  @Patch('/projects/:id')
  async update(
    @Param() params: FindOneParams,
    @Body() updateProjectDto: UpdateProjectDto,
    @Req() request: Request
  ) {
    try {
      const found = await this.projectsService.findOne(params);
      const ability = this.abilityFactory.createForUser(request.user);
      if (!ability.can('update', found)) {
        throw new NotFoundException('Project not found');
      }
      return this.projectsService.update(params, updateProjectDto);
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
