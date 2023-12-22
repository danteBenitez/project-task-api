import { PartialType } from '@nestjs/swagger';
import { CreateUserDto } from './create-user.dto';

export class UpdateUserDto extends PartialType(CreateUserDto) {
    name: string = undefined;
    email: string = undefined;
    password: string = undefined;
    avatar_url: string = undefined;
}
