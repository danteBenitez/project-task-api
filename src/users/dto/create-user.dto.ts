import { User } from '../entities/user.entity';
import {
  IsNotEmpty,
  IsEmail,
  IsString,
  IsOptional,
  IsStrongPassword,
  MinLength,
  IsUrl,
} from 'class-validator';

export class CreateUserDto extends User {
  @IsString({
    message: 'A user must have a name',
  })
  @IsNotEmpty()
  name: string;

  @IsNotEmpty()
  @IsString({
    message: 'A user must have an email',
  })
  @IsEmail()
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
    message: "A user's avatar must be a string",
  })
  @IsUrl({
    require_protocol: true,
  }, {
    message: "Invalid avatar URL"
  })
  @MinLength(10)
  avatar_url: string;
}
