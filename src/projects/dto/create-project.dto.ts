import { Exists } from 'src/common/decorators/exists.decorator';
import { Project } from '../entities/project.entity';
import { User } from 'src/users/entities/user.entity';
import { IsNotEmpty, IsOptional, IsString, IsUUID, IsUrl, MaxLength } from 'class-validator';

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


  @Exists<User>({
    columnName: 'user_id',
    entity: User,
  }, {
    message: 'Author with given ID does not exist',
  })
  @IsUUID('all', {
    message: 'Invalid author ID',
  })
  @IsString({
    message: 'author_id must be a string',
  })
  @IsNotEmpty({
    message: 'author_id is required',
  })
  author_id: string;

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
