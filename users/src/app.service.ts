import { BadRequestException, Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { User } from './user.entity.js';
import { UpdateUser } from './dots/updateuser.dto.js';
import { InjectRepository } from '@nestjs/typeorm';
import { CreatUSer } from './dots/register.dot.js';
import * as bcrypt from 'bcrypt';
import { Login } from './dots/login.dot.js';
import { Payload } from '@nestjs/microservices';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AppService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly jwtService: JwtService,
    private readonly config: ConfigService,
  ) {}
  public async register(register: CreatUSer) {
    const { fname, lname, email, password, userrole } = register;
    const userDB = await this.userRepository.findOne({ where: { email } });
    if (userDB) {
      throw new BadRequestException('User already exist');
    }
    const salt = await bcrypt.genSalt(10);
    const hashPassword = await bcrypt.hash(password, salt);
    let newUser = await this.userRepository.create({
      fname,
      lname,
      email,
      password: hashPassword,
      userrole,
    });
    await this.userRepository.save(newUser);
    return { message: ' Successful Save' };
  }
  public async login(login: Login) {
    const { email, password } = login;
    const user = await this.userRepository.findOne({ where: { email } });
    if (!user) throw new BadRequestException('Email OR Password is Invalid');
    const isPasswordMach = await bcrypt.compare(password, user.password);
    if (!isPasswordMach)
      throw new BadRequestException('Email OR Password is Invalid');
    const Payload = { id: user.id, email: user.email, role: user.userrole };
    const token = await this.jwtService.signAsync(Payload);
    return {
      access_token: token,
    };
  }
  ///////////////////////////////////////////////////////////
  public async getcurrent(id: number) {
    const user = await this.userRepository.findOne({ where: { id } });
    if (!user) throw new BadRequestException('Not Found User');
    return user;
  }
  ///////////////////////////////////////////////////////////////
  public async getAll() {
    const user = await this.userRepository.find();
    return user;
  }
  public async getByOn(id: number) {
    if (!id) {
      throw new BadRequestException('Id is required');
    }
    const user = await this.userRepository.findOne({ where: { id } });
    if (!user) {
      throw new BadRequestException('User is not found ');
    }
    return user;
  }
  public async update(body: UpdateUser, id: number) {
    const user = await this.getByOn(id);
    user.fname = body.fname ?? user.fname;
    user.lname = body.lname ?? user.lname;
    user.email = body.email ?? user.email;
    if (body.password) {
      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(body.password, salt);
    }
    await this.userRepository.save(user);
    delete (user as any).password;
    return user;
  }
  public async delete(id: number) {
    const user = await this.getByOn(id);
    await this.userRepository.remove(user);
    return { message: 'Sccessful remove' };
  }
}
