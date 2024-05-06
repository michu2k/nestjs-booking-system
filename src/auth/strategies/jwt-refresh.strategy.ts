import {Injectable, UnauthorizedException} from "@nestjs/common";
import {ConfigService} from "@nestjs/config";
import {PassportStrategy} from "@nestjs/passport";
import {ExtractJwt, Strategy} from "passport-jwt";
import {Request} from "express";
import {UserService} from "../../user/user.service";

export type JwtPayload = {
  sub: number;
  email: string;
};

@Injectable()
export class JwtRefreshStrategy extends PassportStrategy(Strategy, "jwt-refresh") {
  constructor(
    protected configService: ConfigService,
    private userService: UserService
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([(req: Request) => this.getRefreshTokenCookie(req)]),
      secretOrKey: configService.get("JWT_SECRET"),
      ignoreExpiration: false
    });
  }

  private getRefreshTokenCookie(req: Request) {
    const refreshToken = this.configService.get("REFRESH_TOKEN");
    const cookie = req.cookies[refreshToken];

    if (!cookie) {
      throw new UnauthorizedException();
    }

    return cookie;
  }

  async validate({sub: id, email}: JwtPayload) {
    const user = await this.userService.findOneUser({id, email});

    if (!user) {
      throw new UnauthorizedException();
    }

    return user;
  }
}
