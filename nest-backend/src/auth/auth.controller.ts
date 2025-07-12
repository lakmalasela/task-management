import { Controller, Post, Body,Get,Query,UseGuards,Req,Res,  HttpStatus, } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginUserDto } from '../user/dto/login-user.dto';
import { GoogleAuthGuard } from './auth/guards/google-auth.guard'; // Google Auth Guard
import { AuthGuard } from '@nestjs/passport';
import { Response } from 'express';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  //login for general user
  @Post('login')
  async login(@Body() loginDto: LoginUserDto) {
    const user = await this.authService.validateUser(loginDto.username, loginDto.password,'User');
    if (!user) throw new Error('Invalid credentials');
    return this.authService.login(user);
  }

  @Post("logout")
  async logout(@Res() res: Response) {
    await this.authService.logout(res);
    return res.status(HttpStatus.OK).json({ message: "Logout successful" });
  }

 
}
