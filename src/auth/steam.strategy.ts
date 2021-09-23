import { Strategy } from 'passport-steam';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { User } from 'user/user/entity/user.entity';
import { AuthService } from './auth.service';
import { AuthProviders } from 'typings/graphql';

export type SteamPayload = {
  id: number;
  socialId: string;
  provider: AuthProviders;
  role?: string;
};
@Injectable()
export class SteamStrategy extends PassportStrategy(Strategy) {
  constructor(private authService: AuthService) {
    super({
      returnURL: `${process.env.AUTH_URL}/auth/steam/return`,
      realm: `${process.env.AUTH_URL}`,
      apiKey: process.env.STEAM_APIKEY,
    });
  }

  async validate(identifier: any, profile: any): Promise<any> {
    return await this.authService.validateUser(profile);
  }
}
