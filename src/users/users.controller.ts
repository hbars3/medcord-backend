import { Body, Controller, HttpStatus, Post, Res } from '@nestjs/common';
import { UsersService } from './users.service';
import { Response } from 'express';
import { UserRegisterDto } from './dto/userRegisterDto.dto';

@Controller('users')
export class UsersController {
	constructor(private readonly usersService: UsersService) {}

	@Post('/register')
	async register(@Res() res: Response, @Body() body: UserRegisterDto) {
		try {

				const alreadyRegistered: boolean = await this.usersService.isAlreadyRegistered(body.email);
				if(alreadyRegistered) {
					return res.status(HttpStatus.BAD_REQUEST).json({
						msg: "Usuario ya registrado"
					})
				}

				const msg = await this.usersService.register(body);
				return res.status(HttpStatus.OK).json(msg);

		} catch (error) {
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        msg: 'No se pudo registrar al usuario',
        error
      });
		}
	}
}
