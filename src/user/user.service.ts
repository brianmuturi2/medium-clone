import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>
  ) {
  }
  async createUser(createUserDto: CreateUserDto): Promise<User> {
    const newUser = new User();
    Object.assign(newUser, createUserDto);
    return await this.userRepository.save(newUser);
  }
}
