import { Project } from '../entities/project.entity';
import { IsNotEmpty, IsOptional, IsString, IsUrl, MaxLength } from 'class-validator';

export class CreateProjectDto extends Project {
  @IsString({
    message: 'name must be a string',
  })
  @IsNotEmpty({
    message: 'name is required',
  })
  name: string;


  @IsString({
    message: 'description must be a string',
  })
  @IsNotEmpty({
    message: 'description is required',
  })
  @MaxLength(255, {
    message: 'description must be shorter than or equal to 255 characters',
  })
  description: string;


  @IsOptional()
  @IsString({
    message: 'logo_url must be a string',
  })
  @IsNotEmpty({
    message: 'logo_url must be not empty',
  })
  @IsUrl({
    require_protocol: true,
    },
    {
      message: 'logo_url must be a valid URL',
    },
  )
  logo_url: string;
}
