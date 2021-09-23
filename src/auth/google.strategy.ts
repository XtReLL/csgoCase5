import { PassportStrategy } from '@nestjs/passport';
import { Profile, Strategy } from 'passport-google-oauth20';
import { Injectable } from '@nestjs/common';

import { UserService } from 'user/user/user.service';
import { AuthProviders } from 'typings/graphql';
import { AuthService } from './auth.service';

export type GooglePayload = {
  id: number;
  socialId: string;
  provider: AuthProviders;
  role?: string;
};

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy) {
  constructor(
    private readonly userService: UserService,
    private readonly authService: AuthService,
  ) {
    super({
      clientID: process.env.OAUTH_GOOGLE_ID,
      clientSecret: process.env.OAUTH_GOOGLE_SECRET,
      callbackURL: `${process.env.AUTH_URL}/auth/google/redirect`,
      scope: ['email', 'profile'],
    });
  }

  // async validate(
  //   _accessToken: string,
  //   _refreshToken: string,
  //   profile: Profile,
  // ) {
  //   const { id, name, emails } = profile;

  //   return {
  //     provider: 'google',
  //     providerId: id,
  //   };
  // }

  async validate(
    _accessToken: string,
    _refreshToken: string,
    profile: Profile,
  ): Promise<any> {
    return await this.authService.validateUser(profile);
  }
}
