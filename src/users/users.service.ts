import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserRegisterDto } from './dto/userRegisterDto.dto';
import { User } from './entities/users.entity';
import * as bcrypt from 'bcrypt';
import { UserUpdateDto } from './dto/userUpdateDto.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private usersRepository: Repository<User>,
  ) {}

  async isAlreadyRegistered(email: string) {
    const user = await this.usersRepository.findOne(
      { email },{ select: ['id'] });
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
      telephone: body.telephone
    });

    await this.usersRepository.save(newUser);
    delete newUser.password;

    return { user: newUser };
  }

  async isValid(email: string, password: string): Promise<boolean> {
    const user: User = await this.getByEmail(email);
    if (user == null) { return false }

    return bcrypt.compareSync(password, user.password);
  }

  async getByEmail(email: string, withPassword: boolean = true): Promise<User> {

    const user: User = await this.usersRepository.findOne({
      where: { email } });

    if (!withPassword) { delete user.password }

    return user;
  }

  async update(email: string, body: UserUpdateDto): Promise<User> {

    console.log(email);
    console.log(body);

    const updateEntity = {}

    if (body.email != undefined) {
      updateEntity["email"] = body.email;
    }

    if (body.password != undefined) {
      updateEntity["password"] = this.encryptPassword(body.password);
    }

    if (body.telephone != undefined) {
      updateEntity["telephone"] = body.telephone;
    }

    await this.usersRepository.update(
      {email},
      updateEntity
    );

    const user: User = await this.getByEmail(body.email, false);
    return user;
  }

  async getUsers(): Promise<User[]> {
    const users: User[] = await this.usersRepository.find({
      select: ["id", "name", "lastname", "dni", "email", "gender", "role", "telephone"]
  });
    return users;
  }

  async encryptPassword(password: string): Promise<string> {
    const salt = await bcrypt.genSalt();
    return bcrypt.hash(password, salt);
  }
}
