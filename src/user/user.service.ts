import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { User } from './entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { CreateUserResDto } from './dto/create-user-response.dto';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  private async hashPassword(password: string): Promise<string> {
    return await bcrypt.hash(password, 10);
  }

  async createUser(createUserDto: CreateUserDto): Promise<CreateUserResDto> {
    try {
      const hashedPassword = await this.hashPassword(createUserDto.password);
      const user = await this.userRepository.save({
        email: createUserDto.email,
        password: hashedPassword,
      });
      return {
        statusCode: 201,
        id: user.id,
        email: user.email,
      };
    } catch (err) {
      if (
        err.code === '23505' &&
        err.constraint === 'UQ_e12875dfb3b1d92d7d7c5377e22'
      ) {
        throw new ConflictException('Email already exists');
      }
      throw new BadRequestException(err.message);
    }
  }

  async findUserByEmail(email: string): Promise<User> {
    const user = await this.userRepository.findOneBy({ email });
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return user;
  }
}
