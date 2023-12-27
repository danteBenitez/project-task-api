import { Injectable } from '@nestjs/common';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Project } from './entities/project.entity';
import { Repository } from 'typeorm';
import { FindAllParams } from './dto/params/find-all.params';
import { FindOneParams } from './dto/params/find-one.params';
import { UpdateOneParams } from './dto/params/update-one.params';
import { User } from 'src/users/entities/user.entity';

export class ProjectNotFoundError extends Error {
  message = "Project not found";
}

@Injectable()
export class ProjectsService {
  constructor(
    @InjectRepository(Project) private projectRepository: Repository<Project>,
  ) {}

  async create(createProjectDto: CreateProjectDto, user: User): Promise<Project> {
    const created = this.projectRepository.create(createProjectDto);
    const withUser = this.projectRepository.merge(created, {
      author: user
    });
    await this.projectRepository.save(withUser);
    return created;
  }

  async findAll(params: FindAllParams): Promise<Project[]> {
    const paramsWithCommodin = Object.entries(params).map(([key, value]) => {
      return [key, typeof value === 'string' ? `%${value}%` : value];
    });
    
    return this.projectRepository.find({
      where: Object.fromEntries(paramsWithCommodin) 
    });
  }

  async findByAuthor({ id }: FindOneParams): Promise<Project[]> {
    return this.projectRepository.find({
      where: { author_id: id }
    });
  }

  async findOne(
    { id }: FindOneParams
  ): Promise<Project> {
    const found = await this.projectRepository.findOne({
      where: { project_id: id }
    });

    if (!found) throw new ProjectNotFoundError();

    return found;
  }

  async update({ id }: UpdateOneParams, updateProjectDto: UpdateProjectDto): Promise<Project> {
    const found = await this.projectRepository.findOne({ where: { project_id: id } });

    if (!found) throw new ProjectNotFoundError();

    const updated = this.projectRepository.merge(found, updateProjectDto);
    await this.projectRepository.save(updated);
    return updated;
  }

  async remove({ id }: FindOneParams): Promise<Project> {
    const found = await this.projectRepository.findOne({ where: { project_id: id } });
    if (!found) throw new ProjectNotFoundError();
    await this.projectRepository.remove(found);
    return found;
  }
}
