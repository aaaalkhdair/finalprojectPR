import { Controller, Headers } from '@nestjs/common';
import { AppService } from './app.service.js';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { CreatUSer } from './dots/register.dot.js';
import { UpdateUser } from './dots/updateuser.dto.js';
import { Login } from './dots/login.dot.js';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}
  @MessagePattern('user-creat')
  public registerUser(@Payload() data: { body: CreatUSer }) {
    return this.appService.register(data.body);
  }
  @MessagePattern('login-user')
  public loginUser(@Payload() data: { body: Login }) {
    return this.appService.login(data.body);
  }
  /////////////////////////////////////////////////////////////
  @MessagePattern('user-current')
  public getCurrentUser(@Payload() data: { id : number }) {
    return this.appService.getcurrent(data.id);
  }
  /////////////////////////////////////////////////////////////
  @MessagePattern('user-get-all')
  public getAllUser() {
    return this.appService.getAll();
  }
  @MessagePattern('user-get-single')
  public getSingleUser(@Payload() data: { id: number }) {
    return this.appService.getByOn(data.id);
  }
  @MessagePattern('user-update')
  public updateUser(@Payload() data: { id: number; body: UpdateUser }) {
    return this.appService.update(data.body, data.id);
  }
  @MessagePattern('user-remove')
  public removeUser(@Payload() data: { id: number }) {
    return this.appService.delete(data.id);
  }
}
