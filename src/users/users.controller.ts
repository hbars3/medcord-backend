import {
  Body,
  Controller,
  Get,
  HttpStatus,
  Inject,
  Post,
  Put,
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
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { User } from './entities/users.entity';
import { UserUpdateDto } from './dto/userUpdateDto.dto';

@Controller('users')
@ApiTags('User Management')
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
      if (!(await this.usersService.isValid(body.email, body.password))) {
        return res.status(HttpStatus.BAD_REQUEST).json({
          msg: 'Usuario no registrado'
        });
      }

      const user: User = await this.usersService.getByEmail(body.email, false);

      const jwt: string = await this.authService.getJWT(body);
      return res.status(HttpStatus.OK).json({
        access_token: jwt,
        user: user,
      });
    } catch (error) {
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        msg: 'No se pudo loguear al usuario',
        error,
      });
    }
  }

  // Test endpoint
  // @UseGuards(JwtAuthGuard)
  // @ApiBearerAuth('access-token')
  // @Get('profile')
  // getProfile(@Request() req) {
  //   return req.user;
  // }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('access-token')
  @Put()
  async updateUser(
    @Request() req,
    @Res() res: Response,
    @Body() body: UserUpdateDto,
  ) {
    try {
      const alreadyRegistered: boolean =
        await this.usersService.isAlreadyRegistered(body.email);
      if (alreadyRegistered) {
        return res.status(HttpStatus.BAD_REQUEST).json({
          msg: 'Usuario con el email ingresado ya registrado',
        });
      }

      const user: User = await this.usersService.update(req.user.email, body);

      return res.status(HttpStatus.OK).json({
        msg: 'El usuario ha sido actualizado correctamente',
        user: user,
      });
    } catch (error) {
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        msg: 'No se pudo actualizar al usuario',
        error,
      });
    }
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('access-token')
  @Get()
  async getUsers(
    @Res() res: Response
  ) {
    try {
      const users: User[] = await this.usersService.getUsers();
      return res.status(HttpStatus.OK).json({users});
    } catch (error) {
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        msg: 'No se pudo obtener los usuarios',
        error
      });
    }
  }
}
