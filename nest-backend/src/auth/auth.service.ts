import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserService } from '../user/user.service';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(private jwtService: JwtService, private userService: UserService ) {}

  //validate user
  async validateUser(username: string, password: string,validateType:String): Promise<any> {

       const user = await this.userService.findByUsername(username);
      if (user && await bcrypt.compare(password, user.password)) {
        return user;
      }else{
      return null;
    }
   
  }

  //login for user or organization
  async login(objName: any) {
    const payloadUser = { username: objName.username, sub: objName.id };
    return {
      access_token: this.jwtService.sign(payloadUser),
    };
   
  }

  
}
