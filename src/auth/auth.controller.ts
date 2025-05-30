import { Controller, Get, HttpStatus, Req, Res, UseGuards, VERSION_NEUTRAL } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { ApiTags } from "@nestjs/swagger";
import { Request, Response } from "express";

import { User } from "../decorators/user.decorator";
import { UserEntity } from "../user/user.dto";
import { AuthService } from "./auth.service";
import { createAuthCookies } from "./auth.utils";
import { GoogleAuthGuard } from "./guards/google-auth.guard";
import { JwtAuthGuard } from "./guards/jwt.guard";
import { JwtRefreshAuthGuard } from "./guards/jwt-refresh.guard";

@ApiTags("Auth")
@Controller({ path: "auth", version: VERSION_NEUTRAL })
export class AuthController {
  constructor(
    private authService: AuthService,
    private configService: ConfigService
  ) {}

  /**
   * Google sign in
   */
  @Get("google")
  @UseGuards(GoogleAuthGuard)
  googleAuth() {}

  /**
   * Google sign in callback
   */
  @Get("google/callback")
  @UseGuards(GoogleAuthGuard)
  async googleAuthRedirect(@Res() res: Response, @User() user: UserEntity) {
    const authTokens = await this.authService.generateAuthTokens(user);
    createAuthCookies({ res, ...authTokens });

    const redirectUrl = this.configService.get("AUTH_REDIRECT_URL");
    return res.status(HttpStatus.OK).redirect(redirectUrl);
  }

  /**
   * Refresh a JWT token
   */
  @Get("refresh")
  @UseGuards(JwtRefreshAuthGuard)
  async refresh(@Res() res: Response, @Req() req: Request, @User() user: UserEntity) {
    const refreshToken = this.configService.get("REFRESH_TOKEN");
    const cookie = req.cookies[refreshToken];

    const authTokens = await this.authService.refreshAuthTokens(user, cookie);
    createAuthCookies({ res, ...authTokens });

    return res.status(HttpStatus.OK).send();
  }

  /**
   * Logging a user out of an account
   */
  @Get("logout")
  @UseGuards(JwtAuthGuard)
  logout(@Res() res: Response) {
    const accessToken = this.configService.get("ACCESS_TOKEN");
    const refreshToken = this.configService.get("REFRESH_TOKEN");

    res.clearCookie(accessToken);
    res.clearCookie(refreshToken);

    return res.status(HttpStatus.OK).send();
  }
}
