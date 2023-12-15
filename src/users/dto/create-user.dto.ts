import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsStrongPassword,
  IsUrl,
  MinLength,
} from 'class-validator';
import { IsUnique } from '../../decorators/unique.decorator';
import { User } from '../entities/user.entity';

export class CreateUserDto extends User {
  @IsString({
    message: 'A user must have a name',
  })
  @IsNotEmpty()
  @IsUnique(
    {
      entity: User,
      columnName: 'name',
    },
    {
      message: 'User name must be unique',
    },
  )
  name: string;

  @IsNotEmpty()
  @IsString({
    message: 'A user must have an email',
  })
  @IsEmail()
  @IsUnique(
    {
      entity: User,
      columnName: 'email',
    },
    {
      message: 'User email must be unique',
    },
  )
  email: string;

  @IsNotEmpty()
  @IsStrongPassword(
    {
      minLength: 8,
      minLowercase: 1,
      minUppercase: 1,
      minSymbols: 1,
      minNumbers: 1,
    },
    {
      message:
        'Password is too weak. It must contain at least 8 characters, 1 lowercase, 1 uppercase, 1 number and 1 symbol',
    },
  )
  password: string;

  @IsOptional()
  @IsString({
    message: "A user's avatar URL must be a string",
  })
  @IsUrl(
    {
      require_protocol: true,
    },
    {
      message: 'Invalid avatar URL',
    },
  )
  @MinLength(10)
  avatar_url: string;
}
