import { Test, TestingModule } from '@nestjs/testing';
import { Repository } from 'typeorm';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { User } from './entities/user.entity';
import { getRepositoryToken } from '@nestjs/typeorm';

describe('UserController', () => {
  let userController: UserController;
  let userService: UserService;
  let repositoryMock: Repository<User>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserController],
      providers: [
        UserService,
        {
          provide: getRepositoryToken(User),
          useFactory: () => ({
            save: jest.fn(),
            findOneBy: jest.fn(),
          }),
        },
      ],
    }).compile();
    userController = module.get<UserController>(UserController);
    userService = module.get<UserService>(UserService);
    repositoryMock = module.get(getRepositoryToken(User));
  });

  it('should create a user', async () => {
    const createUserDto: CreateUserDto = {
      email: 'asd@asd.asd',
      password: 'Asd123!',
    };
    const user: User = {
      id: 1,
      email: createUserDto.email,
      password: createUserDto.password,
    };
    const createUserResDto = {
      statusCode: 201,
      id: user.id,
      email: user.email,
    };
    jest.spyOn(userService, 'createUser').mockResolvedValue(createUserResDto);

    expect(await userController.createUser(createUserDto)).toBe(
      createUserResDto,
    );
    expect(userService.createUser).toHaveBeenCalledWith(createUserDto);
  });
});
