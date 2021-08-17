import { Injectable } from '@nestjs/common';
import { UserService } from 'user/user/user.service';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private jwtService: JwtService,
  ) {}

  async validateUser(profile: any): Promise<any> {
    return await this.userService.findOrCreate(profile._json);
  }

  async logIn(user: any): Promise<string> {
    const payload = {
      sub: user.id,
      steamId: user.steamId,
    };

    return this.jwtService.sign(payload);
  }
}
