import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { JwtStrategy } from './jwt.strategy';
import { UserModule } from '../user/user.module';
import { ConfigModule } from '@nestjs/config'


@Module({
  imports: [
    UserModule,
    PassportModule,

    JwtModule.register({
      secret: 'secret123', // should come from env
      signOptions: { expiresIn: '1h' },
    }),
   
  ],
  controllers: [AuthController],
  providers: [AuthService,
    JwtStrategy,
  ],
  exports: [JwtStrategy,AuthService],
})
export class AuthModule {}
// import { Module } from '@nestjs/common';
// import { AuthController } from './auth.controller';
// import { AuthService } from './auth.service';
// import { JwtModule } from '@nestjs/jwt';
// import { PassportModule } from '@nestjs/passport';
// import { JwtStrategy } from './jwt.strategy';
// import { UserModule } from '../user/user.module';
// import { GoogleStrategy } from './strategies/google.strategy';
// import { ConfigModule, ConfigService } from '@nestjs/config';

// @Module({
//   imports: [
//     ConfigModule, // <- ensure ConfigModule is imported
//     UserModule,
//     PassportModule,
//     JwtModule.registerAsync({
//       imports: [ConfigModule],
//       inject: [ConfigService],
//       useFactory: async (configService: ConfigService) => ({
//         secret: configService.get<string>('JWT_SECRET'),
//         signOptions: {
//           expiresIn: configService.get<string>('JWT_EXPIRES_IN'),
//         },
//       }),
//     }),
//   ],
//   controllers: [AuthController],
//   providers: [
//     AuthService,
//     JwtStrategy,
//     GoogleStrategy,
//   ],
//   exports: [JwtStrategy, AuthService],
// })
// export class AuthModule {}
