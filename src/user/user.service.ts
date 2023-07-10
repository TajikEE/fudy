import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as crypto from 'crypto';
import { User } from './entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  private async hashPassword(
    password: string,
  ): Promise<{ salt: string; hash: string }> {
    const salt = crypto.randomBytes(16).toString('hex'); // Generate a random salt
    const hash = crypto
      .pbkdf2Sync(password, salt, 1000, 64, 'sha512')
      .toString('hex'); // Generate the hash

    return { salt, hash };
  }

  async createUser(createUserDto: CreateUserDto): Promise<User> {
    try {
      const { salt, hash } = await this.hashPassword(createUserDto.password);
      const hashedPassword = `${salt}:${hash}`;
      const user = await this.userRepository.save({
        email: createUserDto.email,
        password: hashedPassword,
      });
      return user;
    } catch (err) {
      console.log(err);
    }
  }

  async findUserByEmail(email: string): Promise<User | undefined> {
    return this.userRepository
      .createQueryBuilder('user')
      .where('user.email = :email', { email })
      .getOne();
  }
}
