import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthResolver } from './auth.resolver';
import { UserModule } from 'user/user/user.module';
import { JwtModule } from '@nestjs/jwt';
import { AuthController } from './auth.controller';
import { SteamStrategy } from './steam.strategy';
import { JwtStrategy } from './jwt.strategy';

@Module({
  imports: [
    UserModule,
    JwtModule.register({
      secret: process.env.JWT_KEY,
      signOptions: { expiresIn: '7d' },
    }),
  ],
  providers: [
    AuthService,
    AuthResolver,
    SteamStrategy,
    AuthController,
    JwtStrategy,
  ],
  exports: [AuthService, AuthController],
  controllers: [AuthController],
})
export class AuthModule {}
