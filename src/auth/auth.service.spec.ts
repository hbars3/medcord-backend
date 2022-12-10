import { JwtService } from '@nestjs/jwt';
import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { UserLoginDto } from '../users/dto/userLoginDto.dto';

describe('AuthService', () => {
  let authService: AuthService;
  let jwtService: JwtService;

  const userLoginDto = new UserLoginDto();
  const token = 'access_token';

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AuthService, JwtService],
    }).compile();

    authService = module.get<AuthService>(AuthService);
    jwtService = module.get<JwtService>(JwtService);
  });

  it('Should be defined', () => {
    expect(authService).toBeDefined();
  });

  it('Should return that it returned the access token ', async () => {
    const spy = jest.spyOn(jwtService, 'sign').mockReturnValue(token);
    expect(await authService.getJWT(userLoginDto)).toEqual(token);
    expect(spy).toBeCalledTimes(1);
  });
});
