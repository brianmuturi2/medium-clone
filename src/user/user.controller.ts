import { Body, Controller, Get, Post, Req } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { User as UserEntity  } from './entities/user.entity';
import { UserResponseInterface } from './types/userResponse.interface';
import { LoginUserDto } from './dto/login-user.dto';
import { Request } from 'express'
import { ExpressRequest } from '../types/express.interface';
import { User } from './decorators/user.decorator';

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

  @Get()
  async currentUser(@Req() request: ExpressRequest, @User() user: UserEntity): Promise<UserResponseInterface> {
    return this.userService.buildUserResponse(user);
  }
}
