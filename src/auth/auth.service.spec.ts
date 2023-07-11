import { UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';

import { AuthService } from './auth.service';
import { UserService } from '../user/user.service';
import { TestingModule, Test } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { User } from '../user/entities/user.entity';
import { Repository } from 'typeorm';

describe('AuthService', () => {
  let authService: AuthService;
  let userService: UserService;
  let jwtService: JwtService;
  let userRepository: Repository<User>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        UserService,
        JwtService,
        {
          provide: getRepositoryToken(User),
          useClass: Repository,
        },
      ],
    }).compile();

    authService = module.get<AuthService>(AuthService);
    userService = module.get<UserService>(UserService);
    jwtService = module.get<JwtService>(JwtService);
    userRepository = module.get<Repository<User>>(getRepositoryToken(User));
  });

  describe('login', () => {
    it('should return a token if login is successful', async () => {
      const loginDto = { email: 'test@example.com', password: 'password' };
      const user = {
        id: 1,
        email: loginDto.email,
        password: 'hashedPassword',
      };

      jest
        .spyOn(authService as any, 'validateUser')
        .mockResolvedValueOnce(user);
      jest
        .spyOn(authService as any, 'generateJwtToken')
        .mockReturnValueOnce('token');

      const result = await authService.login(loginDto);

      expect((authService as any).validateUser).toHaveBeenCalledWith(
        loginDto.email,
        loginDto.password,
      );
      expect((authService as any).generateJwtToken).toHaveBeenCalledWith(user);
      expect(result).toEqual({ statusCode: 200, token: 'token' });
    });

    it('should throw UnauthorizedException if login fails', async () => {
      const loginDto = { email: 'test@example.com', password: 'password' };

      jest
        .spyOn(authService as any, 'validateUser')
        .mockResolvedValueOnce(null);

      await expect(authService.login(loginDto)).rejects.toThrowError(
        UnauthorizedException,
      );
    });
  });

  describe('getMe', () => {
    it('should return the user details', async () => {
      const email = 'test@example.com';
      const user = { id: 1, email, password: 'hashedPassword' };

      jest.spyOn(userService, 'findUserByEmail').mockResolvedValueOnce(user);

      const result = await authService.getMe(email);

      expect(userService.findUserByEmail).toHaveBeenCalledWith(email);
      expect(result).toEqual({ statusCode: 200, id: 1, email });
    });
  });
});
