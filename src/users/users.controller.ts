import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ConflictException,
} from '@nestjs/common';
import { NotFoundException } from '@nestjs/common';
import {
  UserConflictError,
  UserNotFoundError,
  UsersService,
} from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { FindOneParams } from './dto/params/find-one.params';
import { UpdateOneParams } from './dto/params/update-one.params';
import { FindUserResponse } from './responses/find-user';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  async create(
    @Body() createUserDto: CreateUserDto,
  ): Promise<FindUserResponse> {
    try {
      const created = await this.usersService.create(createUserDto);
      return new FindUserResponse(created);
    } catch (e) {
      if (e instanceof UserConflictError) {
        throw new ConflictException(e.message);
      }
      console.log(e);
      throw e;
    }
  }

  @Get()
  async findAll(): Promise<FindUserResponse[]> {
    return this.usersService
      .findAll()
      .then((users) => users.map((user) => new FindUserResponse(user)));
  }

  @Get(':id')
  async findOne(@Param() { id }: FindOneParams): Promise<FindUserResponse> {
    try {
      const found = await this.usersService.findOne({
        id,
      });
      return new FindUserResponse(found);
    } catch (e) {
      if (e instanceof UserNotFoundError) {
        throw new NotFoundException(e.message);
      }
      console.log(e);
      throw e;
    }
  }

  @Patch(':id')
  async update(
    @Param() { id }: UpdateOneParams,
    @Body() updateUserDto: UpdateUserDto,
  ): Promise<FindUserResponse> {
    try {
      const found = await this.usersService.update(
        {
          id: id,
        },
        updateUserDto,
      );
      return found;
    } catch (e) {
      if (e instanceof UserNotFoundError) {
        throw new NotFoundException(e.message);
      }
      console.log(e);
      throw e;
    }
  }

  @Delete(':id')
  async remove(@Param() { id }: FindOneParams): Promise<FindUserResponse> {
    try {
      const found = await this.usersService.remove({
        id,
      });
      return new FindUserResponse(found);
    } catch (e) {
      if (e instanceof UserNotFoundError) {
        throw new NotFoundException(e.message);
      }
      console.log(e);
      throw e;
    }
  }
}
