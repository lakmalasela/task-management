import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './user.entity';
import { Repository } from 'typeorm';
import { RegisterUserDto } from './dto/register-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UserService {
  constructor(@InjectRepository(User) private userRepo: Repository<User>,

) {}

// Register the user
async createUser(dto: RegisterUserDto): Promise<User> {
  const salt = await bcrypt.genSalt();
  const hashedPassword = await bcrypt.hash(dto.password, salt);

  // Create user
  const user = this.userRepo.create({
    username: dto.username,
    password: hashedPassword,
    email: dto.email,
    firstName: dto.firstName,
    lastName: dto.lastName
  
  });

  return this.userRepo.save(user);
}

  //Find the user give by email
  async findByEmail(email: string): Promise<User | null> {
    return this.userRepo.findOne({
      where: { email },
    });
  }


 

//patch the users
async patchUser(id: string, dto: UpdateUserDto): Promise<User> {
  const user = await this.userRepo.findOne({ where: { id } });

  if (!user) {
    throw new Error('User not found');
  }

  // Merge only provided fields from dto
  const updatedUser = this.userRepo.merge(user, dto);

  return this.userRepo.save(updatedUser);
}

  
  //Find the user give bu username
  findByUsername(username: string) {
    return this.userRepo.findOne({ where: { username } });
  }
  

  //User List
  findAll(): Promise<User[]> {
    return this.userRepo.find();
  }
}
