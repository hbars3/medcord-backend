import {
  Body,
  Controller,
  Get,
  HttpStatus,
  Inject,
  Post,
  Request,
  Res,
  UseGuards,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { Response } from 'express';
import { UserRegisterDto } from './dto/userRegisterDto.dto';
import { AuthService } from '../auth/auth.service';
import { UserLoginDto } from './dto/userLoginDto.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('users')
export class UsersController {
  @Inject(AuthService)
  private authService: AuthService;

  constructor(private readonly usersService: UsersService) {}

  @Post('/register')
  async register(@Res() res: Response, @Body() body: UserRegisterDto) {
    try {
      const alreadyRegistered: boolean =
        await this.usersService.isAlreadyRegistered(body.email);
      if (alreadyRegistered) {
        return res.status(HttpStatus.BAD_REQUEST).json({
          msg: 'Usuario ya registrado',
        });
      }

      const msg = await this.usersService.register(body);
      return res.status(HttpStatus.OK).json(msg);
    } catch (error) {
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        msg: 'No se pudo registrar al usuario',
        error,
      });
    }
  }

  @Post('login')
  async login(@Res() res: Response, @Body() body: UserLoginDto) {
    try {
      if (!await this.usersService.isValid(body.email, body.password)) {
        return res.status(HttpStatus.BAD_REQUEST).json({
          msg: 'Usuario no registrado',
        });
      }

      const jwt = await this.authService.getJWT(body);
      return res.status(HttpStatus.OK).json(jwt);
    } catch (error) {
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        msg: 'No se pudo loguear al usuario',
        error,
      });
    }
  }

  //Test endpoint
  @UseGuards(JwtAuthGuard)
  @Get('profile')
  getProfile(@Request() req) {
    return req.user;
  }
}
