import { Body, Controller, Post } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { User } from './entities/user.entity';
import { UserResponseInterface } from './types/userResponse.interface';
import { LoginUserDto } from './dto/login-user.dto';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {
  }
  @Post()
  async createUser(@Body('user') createUserDto: CreateUserDto): Promise<UserResponseInterface> {
    console.log('create user ', createUserDto);
    const user = await this.userService.createUser(createUserDto);
    return this.userService.buildUserResponse(user);
  }

  @Post('login')
  async loginUser(@Body('user') loginUserDto: LoginUserDto): Promise<UserResponseInterface> {
    const user = await this.userService.login(loginUserDto);
    return this.userService.buildUserResponse(user);
  }
}
