import {Controller, Get, HttpStatus, Res, UseGuards} from "@nestjs/common";
import {Response} from "express";
import {ConfigService} from "@nestjs/config";
import {UserEntity} from "../user/user.dto";
import {User} from "../decorators/user.decorator";
import {AuthService} from "./auth.service";
import {GoogleAuthGuard} from "./guards/google-auth.guard";
import {JwtAuthGuard} from "./guards/jwt.guard";

@Controller("auth")
export class AuthController {
  constructor(
    private authService: AuthService,
    private configService: ConfigService
  ) {}

  @Get("google")
  @UseGuards(GoogleAuthGuard)
  googleAuth() {}

  @Get("google/callback")
  @UseGuards(GoogleAuthGuard)
  async googleAuthRedirect(@Res() res: Response, @User() user: UserEntity) {
    const accessToken = await this.authService.generateAccessToken(user);

    const accessTokenCookie = this.configService.get("ACCESS_TOKEN");
    const cookieMaxAge = this.configService.get("ACCESS_TOKEN_VALIDITY");
    const redirectUrl = this.configService.get("AUTH_REDIRECT_URL");

    res.cookie(accessTokenCookie, accessToken, {
      maxAge: cookieMaxAge,
      httpOnly: true,
      secure: true,
      sameSite: "lax"
    });

    return res.status(HttpStatus.OK).redirect(redirectUrl);
  }

  @Get("logout")
  @UseGuards(JwtAuthGuard)
  logout(@Res() res: Response) {
    const accessTokenCookie = this.configService.get("ACCESS_TOKEN");

    res.clearCookie(accessTokenCookie);
    return res.status(HttpStatus.OK).send();
  }
}
