import { Inject, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserLoginDto } from 'src/users/dto/userLoginDto.dto';

@Injectable()
export class AuthService {
  @Inject(JwtService)
  private jwtService: JwtService;

  constructor() {}

  async getJWT(user: UserLoginDto): Promise<string> {
    const payload = { email: user.email };
    return this.jwtService.sign(payload);
  }
}
