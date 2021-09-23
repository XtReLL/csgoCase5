import { Injectable } from '@nestjs/common';
import { UserService } from 'user/user/user.service';
import { JwtService } from '@nestjs/jwt';
import { JwtPayload } from './jwt.strategy';
import { GooglePayload } from './google.strategy';
import { AuthProviders } from 'typings/graphql';
import { SteamPayload } from './steam.strategy';
import { User } from 'user/user/entity/user.entity';
import { Profile } from 'passport';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private jwtService: JwtService,
  ) {}

  async validateUser(profile: any): Promise<User> {
    return await this.userService.findOrCreate(profile);
  }

  async loginSteam(user: User): Promise<string> {
    const payload: SteamPayload = {
      id: user.id,
      socialId: user.socialId,
      provider: AuthProviders.steam,
    };

    return this.jwtService.sign(payload);
  }

  async loginGoogle(user: any): Promise<string> {
    const payload: GooglePayload = {
      id: user.id,
      socialId: user.socialId,
      provider: AuthProviders.google,
    };
    return this.jwtService.sign(payload);
  }
}
