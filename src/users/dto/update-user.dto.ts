import { PartialType } from '@nestjs/mapped-types';
import { CreateUserDto } from './create-user.dto';
import { IsEmail, IsOptional, IsString, IsStrongPassword, IsUrl, MinLength } from 'class-validator';

export class UpdateUserDto extends PartialType(CreateUserDto) {
    @IsOptional()
    @IsString({
        message: "A user's name must be a string",
    })
    @MinLength(8)
    name: string = undefined;

    @IsOptional()
    @IsString({
        message: "A user's email must be a string",
    })
    @MinLength(8)
    @IsEmail({}, {
        message: "Invalid user's email"
    })
    email: string = undefined;

    @IsOptional()
    @IsString()
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
    password: string = undefined;
    
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
    avatar_url: string = undefined;
}
