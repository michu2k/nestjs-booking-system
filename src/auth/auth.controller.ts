import {Controller, Get, HttpStatus, Res, UseGuards} from "@nestjs/common";
import {Response} from "express";
import {ConfigService} from "@nestjs/config";
import {UserEntity} from "../user/user.dto";
import {User} from "../decorators/user.decorator";
import {AuthService} from "./auth.service";
import {GoogleAuthGuard} from "./guards/google-auth.guard";
import {JwtAuthGuard} from "./guards/jwt.guard";
import {JwtRefreshAuthGuard} from "./guards/jwt-refresh.guard";

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

  @Get("refresh")
  @UseGuards(JwtRefreshAuthGuard)
  async refresh(@Req() req: Request, @User() user: UserEntity) {
    const refreshToken = this.configService.get("REFRESH_TOKEN");
    const refreshTokenCookie = req.cookies[refreshToken];

    if (!refreshToken) {
      throw new UnauthorizedException();
    }

    return this.authService.refreshAuthTokens(user, refreshTokenCookie);
  }

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
