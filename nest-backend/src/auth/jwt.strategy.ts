

import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config'; 

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly configService: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(), // Extract token from Authorization header
      ignoreExpiration: false, // Ensure expired tokens are not accepted
      secretOrKey: configService.get<string>('JWT_SECRET') || 'secret123', // Use secret from config or fallback to default
    });
  }

  // This is where you can validate the payload and return user information
  async validate(payload: any) {
    console.log('JWT Payload:', payload); // Debug log to see the decoded JWT payload
     return {
        userId: payload.sub,
        username: payload.email,
       
      };

    
   
  }
}
