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
    const user = await this.usersRepository.findOne(
      {
        email,
      },
      {
        select: ['id'],
      },
    );
    return !!user;
  }

  async register(body: UserRegisterDto) {
    const salt = await bcrypt.genSalt();
    const passwordHash = await bcrypt.hash(body.password, salt);

    const newUser = this.usersRepository.create({
      name: body.name,
      lastname: body.lastname,
      dni: body.dni,
      email: body.email,
      gender: body.gender,
      password: passwordHash,
      role: body.role,
      telephone: body.telephone,
      permissions: body.permissions,
    });

    await this.usersRepository.save(newUser);

    return {
      user: newUser,
    };
  }

  async isValid(email: string, password: string): Promise<boolean> {
    const user: User = await this.getByEmail(email);

    if (user == null) {
      return false;
    }

    if (!bcrypt.compareSync(password, user.password)) {
      return false;
    }

    return true;
  }

  async getByEmail(email: string) {
    return await this.usersRepository.findOne({
      where: { email },
    });
  }

  async encryptPassword(password: string): Promise<string> {
    const salt = await bcrypt.genSalt();
    return bcrypt.hash(password, salt);
  }
}
