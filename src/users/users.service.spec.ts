import { Test } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserRegisterDto } from './dto/userRegisterDto.dto';
import { UsersService } from './users.service';
import { User } from './entities/users.entity';

const userRegisterDto = new UserRegisterDto();
const user = new User();
const mockRepository = () => ({
  create: jest.fn(),
  findOne: jest.fn(),
  save: jest.fn(),
});
type MockRepository<T = any> = Partial<
  Record<keyof Repository<User>, jest.Mock>
>;

describe('UserService', () => {
  let userService: UsersService;
  let userRepository: MockRepository<User>;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: getRepositoryToken(User),
          useValue: mockRepository(),
        },
      ],
    }).compile();
    userService = module.get<UsersService>(UsersService);
    userRepository = module.get(getRepositoryToken(User));
  });

  it('Should be defined', () => {
    expect(userService).toBeDefined();
  });
  it('Should return that the user already exists', async () => {
    userRepository.findOne.mockResolvedValue(user);
    expect(await userService.isAlreadyRegistered('example@abc.com')).toEqual(
      true,
    );
    expect(userRepository.findOne).toBeCalledTimes(1);
  });
  it('Should return that the user does not exists', async () => {
    userRepository.findOne.mockResolvedValue(undefined);
    expect(await userService.isAlreadyRegistered('example@xyz.com')).toEqual(
      false,
    );
    expect(userRepository.findOne).toBeCalledTimes(1);
  });
  it('Should return that it registered the user', async () => {
    userRepository.create.mockResolvedValue(user);
    userRepository.save.mockReturnThis();
    expect(await userService.register(userRegisterDto)).toEqual({
      msg: 'Codigo de verificacion enviado',
    });
    expect(userRepository.create).toBeCalledTimes(1);
    expect(userRepository.save).toBeCalledTimes(1);
  });
});
