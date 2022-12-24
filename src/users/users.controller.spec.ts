import { Test, TestingModule } from '@nestjs/testing';
import * as mocks from 'node-mocks-http';
import { AuthService } from '../auth/auth.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { UserLoginDto } from './dto/userLoginDto.dto';
import { UserRegisterDto } from './dto/userRegisterDto.dto';
import { UserUpdateDto } from './dto/userUpdateDto.dto';
import { User } from './entities/users.entity';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';

describe('User Controller', () => {
  let userController: UsersController;
  let userService: UsersService;
  const mockUserService = {
    getByEmail: jest.fn(),
    getDoctors: jest.fn(),
    getUsers: jest.fn(),
    isAlreadyRegistered: jest.fn(),
    isValid: jest.fn(),
    register: jest.fn(),
    update: jest.fn(),
  };
  const mockAuthService = {
    getJWT: jest.fn(),
  };
  const res = mocks.createResponse();
  const req = mocks.createRequest();
  const user = new User();
  const users = [user];
  const userLoginDto = new UserLoginDto();
  const userRegisterDto = new UserRegisterDto();
  const userUpdateDto = new UserUpdateDto();
  const token = {
    access_token: 'test',
  };
  beforeEach(async () => {
    const moduleRef: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [UsersService, AuthService],
    })
      .overrideProvider(UsersService)
      .useValue(mockUserService)
      .overrideProvider(AuthService)
      .useValue(mockAuthService)
      .compile();
    userController = moduleRef.get<UsersController>(UsersController);
    userService = moduleRef.get<UsersService>(UsersService);
  });
  
  it('Should be defined', () => {
    expect(userController).toBeDefined();
  });

  it('Should return that it registered the user', async () => {
    mockUserService.isAlreadyRegistered.mockReturnValue(false);
    mockUserService.register.mockReturnValue(
      'The user has been created successfully',
    );
    const response = await userController.register(res, userRegisterDto);
    expect(response.statusCode).toEqual(200);
    expect(mockUserService.isAlreadyRegistered).toBeCalledTimes(1);
    expect(mockUserService.register).toBeCalledTimes(1);
  });
  it('Should return that it did not register the user', async () => {
    jest
      .spyOn(userService, 'isAlreadyRegistered')
      .mockRejectedValue(new Error());
    const response = await userController.register(res, userRegisterDto);
    expect(response.statusCode).toEqual(500);
    expect(mockUserService.isAlreadyRegistered).toBeCalledTimes(2);
  });
  it('Should return that the user already exists', async () => {
    mockUserService.isAlreadyRegistered.mockReturnValue(true);
    const response = await userController.register(res, userRegisterDto);
    expect(response.statusCode).toEqual(400);
    expect(mockUserService.isAlreadyRegistered).toBeCalledTimes(3);
  });

  it('Should return that the user have not registered yet', async () => {
    mockUserService.isValid.mockReturnValue(false);
    const response = await userController.login(res, userLoginDto);
    expect(response.statusCode).toEqual(400);
    expect(mockUserService.isValid).toBeCalledTimes(1);
  });
  it('Should return that the user is logged in', async () => {
    mockUserService.isValid.mockReturnValue(true);
    mockUserService.getByEmail.mockReturnValue(user);
    mockAuthService.getJWT.mockReturnValue(token);
    const response = await userController.login(res, userLoginDto);
    expect(response.statusCode).toEqual(200);
    expect(mockUserService.isValid).toBeCalledTimes(2);
    expect(mockAuthService.getJWT).toBeCalledTimes(1);
  });
  it('Should return that the user could not log in', async () => {
    jest.spyOn(userService, 'isValid').mockRejectedValue(new Error());
    const response = await userController.login(res, userLoginDto);
    expect(response.statusCode).toEqual(500);
    expect(mockUserService.isValid).toBeCalledTimes(3);
  });

  it('Should ensure the JwtAuthGuard is applied to the updateUser method', async () => {
    const updateUserGuard = Reflect.getMetadata('__guards__', UsersController.prototype.updateUser)
    expect(new (updateUserGuard[0])).toBeInstanceOf(JwtAuthGuard)
  });
  it('Should return that it did not update the user', async () => {
    mockUserService.isAlreadyRegistered.mockReturnValue(true);
    const response = await userController.updateUser(req, res, userUpdateDto);
    expect(response.statusCode).toEqual(400);
    expect(mockUserService.isAlreadyRegistered).toBeCalledTimes(4);
  });
  it('Should return that it updated the user ', async () => {
    req.user = {
      email: 'example@gmail.com',
    };
    mockUserService.isAlreadyRegistered.mockReturnValue(false);
    mockUserService.update.mockReturnValue(user);
    const response = await userController.updateUser(req, res, userUpdateDto);
    expect(response.statusCode).toEqual(200);
    expect(mockUserService.isAlreadyRegistered).toBeCalledTimes(5);
    expect(mockUserService.update).toBeCalledTimes(1);
  });
  it('Should return that the update failed', async () => {
    mockUserService.isAlreadyRegistered.mockRejectedValue(new Error());
    const response = await userController.updateUser(req, res, userUpdateDto);
    expect(response.statusCode).toEqual(500);
    expect(mockUserService.isAlreadyRegistered).toBeCalledTimes(6);
  });

  it('Should ensure the JwtAuthGuard is applied to the getUsers method', async () => {
    const getUsersGuard = Reflect.getMetadata('__guards__', UsersController.prototype.getUsers)
    expect(new (getUsersGuard[0])).toBeInstanceOf(JwtAuthGuard)
  });
  it('Should return that it retrieved all the users', async () => {
    mockUserService.getUsers.mockReturnValue(users);
    const response = await userController.getUsers(res);
    expect(response.statusCode).toEqual(200);
    expect(mockUserService.getUsers).toBeCalledTimes(1);
  });
  it('Should return that it did not retrieve all the users', async () => {
    mockUserService.getUsers.mockRejectedValue(new Error());
    const response = await userController.getUsers(res);
    expect(response.statusCode).toEqual(500);
    expect(mockUserService.getUsers).toBeCalledTimes(2);
  });

  it('Should ensure the JwtAuthGuard is applied to the getDoctors method', async () => {
    const getDoctorsGuard = Reflect.getMetadata('__guards__', UsersController.prototype.getDoctors)
    expect(new (getDoctorsGuard[0])).toBeInstanceOf(JwtAuthGuard)
  });
  it('Should return that it retrieved all the doctors', async () => {
    mockUserService.getDoctors.mockReturnValue(users);
    const response = await userController.getDoctors(res);
    expect(response.statusCode).toEqual(200);
    expect(mockUserService.getDoctors).toBeCalledTimes(1);
  });
  it('Should return that it did not retrieve all the doctors', async () => {
    mockUserService.getDoctors.mockRejectedValue(new Error());
    const response = await userController.getDoctors(res);
    expect(response.statusCode).toEqual(500);
    expect(mockUserService.getDoctors).toBeCalledTimes(2);
  });
});
