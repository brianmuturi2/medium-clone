import { Body, Controller, Post } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { User } from './entities/user.entity';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {
  }
  @Post()
  async createUser(@Body('user') createUserDto: CreateUserDto): Promise<User> {
    console.log('create user ', createUserDto);
    return this.userService.createUser(createUserDto);
  }
}
