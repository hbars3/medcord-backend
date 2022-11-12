import { Test } from '@nestjs/testing';
import { UsersController } from './users.controller';
import { UserRegisterDto } from './dto/userRegisterDto.dto';
import * as mocks from 'node-mocks-http';
import { UsersService } from './users.service';

describe('Notes Controller', () => {
  let userController: UsersController;
  let userService: UsersService;
  const mockUserService = {
    isAlreadyRegistered: jest.fn(),
    register: jest.fn(),
  };
  const res = mocks.createResponse();
  const userRegisterDto = new UserRegisterDto();
  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [UsersService],
    })
      .overrideProvider(UsersService)
      .useValue(mockUserService)
      .compile();
      userController = moduleRef.get<UsersController>(UsersController);
      userService = moduleRef.get<UsersService>(UsersService);
  });
  it('Should return that it registered the user', async () => {
    mockUserService.isAlreadyRegistered.mockReturnValue(false);
    const response = await userController.register(res, userRegisterDto);
    expect(response.statusCode).toEqual(200);
    expect(mockUserService.isAlreadyRegistered).toBeCalledTimes(1);
    expect(mockUserService.register).toBeCalledTimes(1);
  });
  it('Should return that it did not register the user', async () => {
    jest.spyOn(userService, 'isAlreadyRegistered').mockRejectedValue(new Error());
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
});
