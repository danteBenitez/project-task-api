import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { FindUserResponse } from './responses/find-user';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import { FindOneParams } from './dto/params/find-one.params';

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
  ) {}

  async create(createUserDto: CreateUserDto): Promise<FindUserResponse> {
    const existing = await this.userRepository.findOne({
      where: [
        {
          email: createUserDto.email,
        },
        {
          name: createUserDto.name,
        },
      ],
    });

    if (!existing) {
      throw new UserConflictError();
    }

    const created = this.userRepository.create(createUserDto);
    await this.userRepository.save(created);
    return new FindUserResponse(created);
  }

  async findAll(): Promise<FindUserResponse[]> {
    return this.userRepository.find();
  }

  async findOne({ id }: FindOneParams): Promise<FindUserResponse> {
    const found = await this.userRepository.findOne({
      where: { user_id: id },
    });

    if (!found) {
      throw new UserNotFoundError();
    }

    return new FindUserResponse(found);
  }

  async update(
    { id }: FindOneParams,
    updateUserDto: UpdateUserDto,
  ): Promise<FindUserResponse> {
    const found = await this.userRepository.findOne({
      where: { user_id: id },
    });

    if (!found) {
      throw new UserNotFoundError();
    }

    const updated = this.userRepository.merge(found, updateUserDto);
    await this.userRepository.save(updated);
    return new FindUserResponse(updated);
  }

  async remove({ id }: FindOneParams): Promise<FindUserResponse> {
    const found = await this.userRepository.findOne({
      where: { user_id: id },
    });
    if (!found) {
      throw new UserNotFoundError();
    }
    await this.userRepository.softDelete({
      user_id: id,
    });
    return new FindUserResponse(found);
  }
}
