import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { FindUserResponse } from './responses/find-user';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import { FindOneParams } from './dto/params/find-one.params';
import * as bcrypt from 'bcrypt';
import { ConfigService } from '@nestjs/config';
import { ENVIRONMENT } from 'src/config/env';
import { UpdateOneParams } from './dto/params/update-one.params';

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
    private readonly config: ConfigService
  ) {}

  async create(createUserDto: CreateUserDto): Promise<User> {
    const created = this.userRepository.create(createUserDto);
    const merged = this.userRepository.merge(created, {
      // @ts-expect-error SALT_ROUNDS is not being recognized as a valid key
      password: await bcrypt.hash(createUserDto.password, +this.config.get<ENVIRONMENT["SALT_ROUNDS"]>('SALT_ROUNDS')),
    })
    await this.userRepository.save(merged);
    return merged;
  }

  async findAll(): Promise<User[]> {
    return await this.userRepository.find();
  }

  async findOne({ id }: FindOneParams): Promise<User> {
    const found = await this.userRepository.findOne({
      where: { user_id: id },
    });

    if (!found) {
      throw new UserNotFoundError();
    }

    return found;
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
