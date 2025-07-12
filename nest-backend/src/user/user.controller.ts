// src/user/user.controller.ts
import { Controller, Get, Post, Body, Param, Put, Delete,Patch } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './interfaces/user.interface';
import { RegisterUserDto } from './dto/register-user.dto';
import { JwtAuthGuard } from '../auth/auth/guards/jwt-auth.guard'
import { UseGuards } from '@nestjs/common'

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  //User register
  @Post('register')
  async create(@Body() dto: RegisterUserDto) {
    const user = await this.userService.createUser(dto);
    return { message: 'User created', user };
  }

//Patch Use
@UseGuards(JwtAuthGuard)
@Patch(':id')
async patch(@Param('id') id: string, @Body() dto: UpdateUserDto) {
  const user = await this.userService.patchUser(id, dto);
  return { message: 'User updated', user };
}
  // @Get()
  // findAll(): User[] {
  //   return this.userService.findAll();
  // }

  // @Get(':id')
  // findOne(@Param('id') id: number): User {
  //   return this.userService.findOne(id);
  // }

  // @Put(':id')
  // update(@Param('id') id: number, @Body() updateUserDto: UpdateUserDto): User {
  //   return this.userService.update(id, updateUserDto);
  // }

  // @Delete(':id')
  // remove(@Param('id') id: number): boolean {
  //   return this.userService.remove(id);
  // }
}
