import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import { FindOneParams } from './dto/params/find-one.params';
import * as bcrypt from 'bcrypt';
import { ConfigService } from '@nestjs/config';
import { ENVIRONMENT } from 'src/config/env';
import { UpdateOneParams } from './dto/params/update-one.params';
import { Role, Roles } from 'src/auth/entities/role.entity';

export class UserConflictError extends Error {
  message = 'User already exists';
}
export class UserNotFoundError extends Error {
  message = 'User not found';
}

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
    @InjectRepository(Role) private roleRepository: Repository<Role>,
    private readonly config: ConfigService
  ) {}

  async create(createUserDto: CreateUserDto): Promise<User> {
    const created = this.userRepository.create(createUserDto);
    const role = await this.roleRepository.findOne({ where: { name: Roles.USER } });
    console.log(role);
    const merged = this.userRepository.merge(created, {
      // @ts-expect-error SALT_ROUNDS is not being recognized as a valid key
      password: await bcrypt.hash(createUserDto.password, +this.config.get<ENVIRONMENT["SALT_ROUNDS"]>('SALT_ROUNDS')),
      role
    })
    console.log(merged);
    await this.userRepository.save(merged);
    return merged;
  }

  async findAll(): Promise<User[]> {
    return await this.userRepository.find();
  }

  async findOne({ id }: FindOneParams): Promise<User> {
    const found = await this.userRepository.findOne({
      where: { user_id: id },
      relations: {
        role: true,
      } 
    });

    if (!found) {
      throw new UserNotFoundError();
    }

    return found;
  }

  async findOneByNameOrEmail({ name = '', email = '' }: {
    name?: string, email?: string
  }): Promise<User> {
    const found = await this.userRepository.findOne({
      where: [{ name }, { email }],
    });

    if (!found) {
      throw new UserNotFoundError();
    }

    return found;
  }

  async comparePassword(user: User, password: string) {
    return bcrypt.compare(password, user.password);
  }

  async update(
    { id }: UpdateOneParams,
    updateUserDto: UpdateUserDto,
  ): Promise<User> {
    const found = await this.userRepository.findOne({
      where: { user_id: id },
    });

    if (!found) {
      throw new UserNotFoundError();
    }

    const updated = this.userRepository.merge(found, updateUserDto);
    await this.userRepository.save(updated);
    return updated;
  }

  async remove({ id }: FindOneParams): Promise<User> {
    const found = await this.userRepository.findOne({
      where: { user_id: id },
    });
    if (!found) {
      throw new UserNotFoundError();
    }
    await this.userRepository.softDelete({
      user_id: id,
    });
    return found;
  }
}
