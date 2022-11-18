import { Test } from '@nestjs/testing';
import { JwtStrategy } from './jwt.strategy';
const email = 'abc@example.com';
const payload = {
  email: email,
};

describe('JWT Strategy Service', () => {
  let jwtStrategy: JwtStrategy;
  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [JwtStrategy],
    }).compile();
    jwtStrategy = module.get<JwtStrategy>(JwtStrategy);
  });

  it('Should be defined', () => {
    expect(jwtStrategy).toBeDefined();
  });
  it('Should return that it validated the payload', async () => {
    expect(await jwtStrategy.validate(payload)).toEqual({
      email: payload.email,
    });
  });
});
