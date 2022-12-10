import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';
import * as dotenv from 'dotenv';
import { Repository } from 'typeorm';
import { UserRegisterDto } from './dto/userRegisterDto.dto';
import { UserUpdateDto } from './dto/userUpdateDto.dto';
import { User } from './entities/users.entity';
import { UsersService } from './users.service';

dotenv.config();

describe('UserService', () => {
  const userRegisterDto = new UserRegisterDto();
  const userUpdateDto = new UserUpdateDto();
  const user = new User();
  const email = 'example@xyz.com';
  const password = process.env.TEST_PASSWORD;
  const telephone = '1234567';

  const mockRepository = () => ({
    create: jest.fn(),
    findOne: jest.fn(),
    save: jest.fn(),
    update: jest.fn(),
  });
  type MockRepository<User> = Partial<
    Record<keyof Repository<User>, jest.Mock>
  >;

  let userService: UsersService;
  let userRepository: MockRepository<User>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
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
    expect(await userService.isAlreadyRegistered(email)).toEqual(true);
    expect(userRepository.findOne).toBeCalledTimes(1);
  });
  it('Should return that the user does not exists', async () => {
    userRepository.findOne.mockResolvedValue(undefined);
    expect(await userService.isAlreadyRegistered(email)).toEqual(false);
    expect(userRepository.findOne).toBeCalledTimes(1);
  });

  it('Should return that it registered the user', async () => {
    jest.spyOn(bcrypt, 'genSalt').mockReturnThis();
    jest.spyOn(bcrypt, 'hash').mockReturnThis();
    userRepository.create.mockReturnValue(user);
    userRepository.save.mockReturnThis();
    expect(await userService.register(userRegisterDto)).toEqual({
      user: user,
    });
    expect(userRepository.create).toBeCalledTimes(1);
    expect(userRepository.save).toBeCalledTimes(1);
  });

  it('Should return that the user does not exists', async () => {
    jest.spyOn(userService, 'getByEmail').mockResolvedValue(undefined);
    expect(await userService.isValid(email, password)).toBeFalsy();
    expect(userService.getByEmail).toHaveBeenCalled();
  });
  it('Should return that the credentials were not valid', async () => {
    jest.spyOn(userService, 'getByEmail').mockResolvedValue(user);
    jest.spyOn(bcrypt, 'compareSync').mockReturnValue(false);
    expect(await userService.isValid(email, password)).toBeFalsy();
    expect(userService.getByEmail).toHaveBeenCalled();
  });
  it('Should return that the credentials were valid', async () => {
    jest.spyOn(userService, 'getByEmail').mockResolvedValue(user);
    jest.spyOn(bcrypt, 'compareSync').mockReturnValue(true);
    expect(await userService.isValid(email, password)).toBeTruthy();
    expect(userService.getByEmail).toHaveBeenCalled();
  });

  it('Should return that the user was found by email', async () => {
    userRepository.findOne.mockResolvedValue(user);
    expect(await userService.getByEmail(email)).toEqual(user);
    expect(userRepository.findOne).toHaveBeenCalled();
  });
  it('Should return that the user was not found by email', async () => {
    userRepository.findOne.mockResolvedValue(undefined);
    expect(await userService.getByEmail(email)).toEqual(undefined);
    expect(userRepository.findOne).toHaveBeenCalled();
  });
  it('Should return that the user was found by email and it did not have password', async () => {
    userRepository.findOne.mockResolvedValue(user);
    expect(await userService.getByEmail(email, false)).toEqual(user);
    expect(userRepository.findOne).toHaveBeenCalled();
  });

  it('Should return that the user was updated successfully without any changes', async () => {
    userRepository.update.mockReturnThis();
    jest.spyOn(userService, 'getByEmail').mockResolvedValue(user);
    expect(await userService.update(email, userUpdateDto)).toEqual(user);
  });
  it('Should return that the user was updated successfully with any changes', async () => {
    userUpdateDto.email = email;
    userUpdateDto.password = password;
    userUpdateDto.telephone = telephone;
    userRepository.update.mockReturnThis();
    jest.spyOn(userService, 'getByEmail').mockResolvedValue(user);
    expect(await userService.update(email, userUpdateDto)).toEqual(user);
  });
  
  it('Should return that it encrypted the password', async () => {
    jest.spyOn(bcrypt, 'genSalt').mockReturnThis();
    jest.spyOn(bcrypt, 'hash').mockImplementationOnce(() => {
      return 'password';
    });
    expect(await userService.encryptPassword(password)).toEqual('password');
    expect(bcrypt.genSalt).toHaveBeenCalled();
    expect(bcrypt.hash).toHaveBeenCalled();
  });
  it('Should return that it did not encrypt the password', async () => {
    jest.spyOn(bcrypt, 'genSalt').mockReturnThis();
    jest.spyOn(bcrypt, 'hash').mockImplementationOnce(() => {
      return undefined;
    });
    expect(await userService.encryptPassword(password)).toEqual(undefined);
    expect(bcrypt.genSalt).toHaveBeenCalled();
    expect(bcrypt.hash).toHaveBeenCalled();
  });
});
