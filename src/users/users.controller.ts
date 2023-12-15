import { Controller, Get, Post, Body, Patch, Param, Delete, ConflictException } from '@nestjs/common';
import { NotFoundException } from '@nestjs/common';
import { UserConflictError, UserNotFoundError, UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { FindOneParams } from './dto/params/find-one.params';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  create(@Body() createUserDto: CreateUserDto) {
    try {
      const created = this.usersService.create(createUserDto);
      return created;
    } catch(e) {
      if (e instanceof UserConflictError) {
        throw new ConflictException(e.message);
      }
      console.log(e);
      throw e; 
    }
  }

  @Get()
  findAll() {
    return this.usersService.findAll();
  }

  @Get(':id')
  findOne(@Param() { id }: FindOneParams) {
    try {
      const found = this.usersService.findOne({
        id
      });
      return found;
    } catch (e) {
      if (e instanceof UserNotFoundError) {
        throw new NotFoundException(e.message);
      } 
      console.log(e);
      throw e;
    }
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.update({
      id: id
    }, updateUserDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.usersService.remove({
      id
    });
  }
}
