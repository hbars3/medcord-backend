import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserRegisterDto } from './dto/userRegisterDto.dto';
import { User } from './entities/users.entity';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
    constructor(
        @InjectRepository(User) private usersRepository: Repository<User>,
    ) {}

    async isAlreadyRegistered(email: string) {
        const user = await this.usersRepository.findOne({
          email,
        }, {
          select: ['id'],
        });
        return !!user;
      }

    async register(body: UserRegisterDto) {

        const randomPassword = Math.random().toString(36).slice(-8);

        const salt = await bcrypt.genSalt();
        const passwordHash = await bcrypt.hash(randomPassword, salt);

        const newUser = this.usersRepository.create({
            name: body.name,
            lastname: body.lastname,
            dni: body.dni,
            email: body.email,
            gender: body.gender,
            password: passwordHash,
            role: body.role,
            telephone: body.telephone,
            permissions: body.permissions
        });
        
        await this.usersRepository.save(newUser);
        
        return {
            msg: "Codigo de verificacion enviado"
        }
    }
}
