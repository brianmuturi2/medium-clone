import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import { sign } from 'jsonwebtoken';
import { JWT_SECRET } from '../config';
import { UserResponseInterface } from './types/userResponse.interface';
import { LoginUserDto } from './dto/login-user.dto';
import { compare } from 'bcrypt';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>
  ) {
  }
  async createUser(createUserDto: CreateUserDto): Promise<User > {
    const userByEmail = await this.userRepository.findOne({
      email: createUserDto.email
    });
    const userByUsername = await this.userRepository.findOne({
      username: createUserDto.username
    });
    if (userByEmail || userByUsername) {
      throw new HttpException('Email or username are taken', HttpStatus.UNPROCESSABLE_ENTITY);
    }
    const newUser = new User();
    Object.assign(newUser, createUserDto);
    return await this.userRepository.save(newUser);
  }

  async findById(id: number): Promise<User> {
    return this.userRepository.findOne(id);
  }

  async login(loginUserDto: LoginUserDto): Promise<User> {
    const user = await this.userRepository.findOne(
      {
                  email: loginUserDto.email
                },
      { select: ['id', 'username', 'email', 'bio', 'image', 'password'] }
    );
    if (!user) {
      throw new HttpException('Credentials are not valid', HttpStatus.UNPROCESSABLE_ENTITY);
    }

    const isPasswordCorrect = await compare(loginUserDto.password, user.password);

    if (!isPasswordCorrect) {
      throw new HttpException('Credentials are not valid', HttpStatus.UNPROCESSABLE_ENTITY);
    }
    delete user.password;
    return user;
  }

  buildUserResponse(user: User): UserResponseInterface {
    return {
      user: {
        ...user,
        token: this.generateJwt(user)
      }
    }
  }

  generateJwt(user: User): string {
    return sign({
      id: user.id,
      username: user.username,
      email: user.email
    }, JWT_SECRET);
  }
}
