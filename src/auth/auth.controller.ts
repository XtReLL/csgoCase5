import { Controller, Get, UseGuards, Req, Res } from '@nestjs/common';
import { Request, Response } from 'express';
import { AuthGuard } from '@nestjs/passport';
import { AuthService } from './auth.service';
import { User } from 'user/user/entity/user.entity';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @UseGuards(AuthGuard('google'))
  @Get('google')
  async googleAuth(@Req() req: Request) {
    return;
  }

  @UseGuards(AuthGuard('google'))
  @Get('google/redirect')
  async googleAuthRedirect(@Req() req: Request, @Res() res: Response) {
    const accessToken = await this.authService.loginGoogle(req.user);

    res.redirect(`${process.env.FRONT_URL}/auth/google?token=${accessToken}`);
    return accessToken;
  }

  @UseGuards(AuthGuard('steam'))
  @Get('steam')
  async login(): Promise<void> {
    return;
  }

  @UseGuards(AuthGuard('steam'))
  @Get('steam/return')
  async handler(@Req() req: Request, @Res() res: Response): Promise<string> {
    const accessToken = await this.authService.loginSteam(req.user as User);

    res.redirect(`${process.env.FRONT_URL}/auth/steam?token=${accessToken}`);

    return accessToken;
  }
}
