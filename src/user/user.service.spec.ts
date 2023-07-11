import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import {
  BadRequestException,
  ConflictException,
  NotFoundException,
} from '@nestjs/common';
import * as bcrypt from 'bcrypt';

import { UserService } from './user.service';
import { User } from './entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { CreateUserResDto } from './dto/create-user-response.dto';

describe('UserService', () => {
  let userService: UserService;
  let userRepository: Repository<User>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        {
          provide: getRepositoryToken(User),
          useClass: Repository,
        },
      ],
    }).compile();

    userService = module.get<UserService>(UserService);
    userRepository = module.get<Repository<User>>(getRepositoryToken(User));
  });

  describe('createUser', () => {
    const createUserDto: CreateUserDto = {
      email: 'test@example.com',
      password: 'password',
    };

    it('should create a new user and return user details', async () => {
      const hashedPassword = 'hashedPassword';
      jest
        .spyOn(bcrypt, 'hash')
        .mockImplementation(() => Promise.resolve(hashedPassword));
      const saveSpy = jest.spyOn(userRepository, 'save').mockResolvedValueOnce({
        id: 1,
        email: createUserDto.email,
        password: hashedPassword,
      });

      const result: CreateUserResDto = await userService.createUser(
        createUserDto,
      );

      expect(bcrypt.hash).toHaveBeenCalledWith(createUserDto.password, 10);
      expect(saveSpy).toHaveBeenCalledWith(
        expect.objectContaining({
          email: createUserDto.email,
          password: hashedPassword,
        }),
      );
      expect(result.statusCode).toBe(201);
      expect(result.id).toBe(1);
      expect(result.email).toBe(createUserDto.email);
    });

    it('should throw ConflictException if user creation fails due to duplicate email', async () => {
      const errorMessage = 'Email already exists';
      const error = {
        code: '23505',
        constraint: 'UQ_e12875dfb3b1d92d7d7c5377e22',
      };
      jest
        .spyOn(bcrypt, 'hash')
        .mockImplementation(() => Promise.resolve('hashedPassword'));
      jest
        .spyOn(userRepository, 'save')
        .mockRejectedValueOnce({ message: errorMessage, ...error } as any);

      await expect(userService.createUser(createUserDto)).rejects.toThrowError(
        ConflictException,
      );
    });
  });

  describe('findUserByEmail', () => {
    const email = 'test@example.com';

    it('should return the user if found', async () => {
      const findOneSpy = jest
        .spyOn(userRepository, 'findOneBy')
        .mockResolvedValueOnce({
          id: 1,
          email,
          password: 'hashedPassword',
        });

      const result: User = await userService.findUserByEmail(email);

      expect(findOneSpy).toHaveBeenCalledWith({ email });
      expect(result.id).toBe(1);
      expect(result.email).toBe(email);
    });

    it('should throw NotFoundException if user is not found', async () => {
      jest.spyOn(userRepository, 'findOneBy').mockResolvedValueOnce(undefined);

      await expect(userService.findUserByEmail(email)).rejects.toThrow(
        NotFoundException,
      );
    });
  });
});
