// src/user/dto/create-user.dto.ts
import { IsString, IsInt, IsOptional, IsEmail, Length } from 'class-validator';

export class CreateUserDto {
  @IsString()
  @Length(3, 50)
  name: string;

  @IsEmail()
  email: string;

  @IsInt()
  @IsOptional()
  age?: number;
}

export class UpdateUserDto {
  @IsString()
  @Length(3, 50)
  @IsOptional()
  name?: string;

  @IsEmail()
  @IsOptional()
  email?: string;

  @IsInt()
  @IsOptional()
  age?: number;
}
