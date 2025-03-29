import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  ParseIntPipe,
  ValidationPipe,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Controller('users') // "/users" prefix
export class UsersController {
  //nestJS automatically handles: const usersService = new UsersService();
  constructor(private readonly usersService: UsersService) {}

  @Get() // GET /users or /users?role=value&age=value
  fildAll(
    @Query('email') email?: string,
    @Query('isActive') isActive?: boolean,
  ) {
    return this.usersService.findAll(email, isActive);
  }

  @Get(':id') // GET /users:id
  findOne(@Param('id', ParseIntPipe) id: number) {
    //+id (Unary plus) is a shorthand for Number(id)
    return this.usersService.findOne(id);
  }

  @Post() // POST /users
  create(@Body(ValidationPipe) createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  @Patch(':id') // PATCH /users:id
  updateOne(
    @Param('id', ParseIntPipe) id: number,
    @Body(ValidationPipe) updateUserDto: UpdateUserDto,
  ) {
    return this.usersService.update(id, updateUserDto);
  }

  @Delete(':id') // DELETE /users:id
  deleteOne(@Param('id', ParseIntPipe) id: number) {
    return this.usersService.delete(id);
  }
}
