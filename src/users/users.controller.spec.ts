import { Test } from '@nestjs/testing';
import { UsersController } from './users.controller';
import { UserRegisterDto } from './dto/userRegisterDto.dto';
import { UserLoginDto } from './dto/userLoginDto.dto';
import * as mocks from 'node-mocks-http';
import { AuthService } from '../auth/auth.service';
import { UsersService } from './users.service';

describe('Notes Controller', () => {
  let userController: UsersController;
  let userService: UsersService;
  const mockUserService = {
    isAlreadyRegistered: jest.fn(),
    register: jest.fn(),
    isValid: jest.fn(),
  };
  const mockAuthService = {
    getJWT: jest.fn(),
  };
  const res = mocks.createResponse();
  const req = mocks.createRequest();
  const userRegisterDto = new UserRegisterDto();
  const userLoginDto = new UserLoginDto();
  const token = {
    access_token: 'test',
  };
  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
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
    mockAuthService.getJWT.mockReturnValue(token);
    const response = await userController.login(res, userLoginDto);
    expect(response.statusCode).toEqual(200);
    expect(mockUserService.isValid).toBeCalledTimes(2);
    expect(mockAuthService.getJWT).toBeCalledTimes(1);
  });
  it('Should return that the user could not log in', async () => {
    jest
      .spyOn(userService, 'isValid')
      .mockRejectedValue(new Error());
    const response = await userController.login(res, userLoginDto);
    expect(response.statusCode).toEqual(500);
    expect(mockUserService.isValid).toBeCalledTimes(3);
  });
  it('Should return that the getProfile method executed successfully', async () => {
    const response = await userController.getProfile(req);
    expect(response).toEqual(req.user);
  });
});
