import {Injectable, UnauthorizedException} from "@nestjs/common";
import {ConfigService} from "@nestjs/config";
import {PassportStrategy} from "@nestjs/passport";
import {Request} from "express";
import {ExtractJwt, Strategy} from "passport-jwt";

import {UserEntity} from "../../user/user.dto";
import {UserService} from "../../user/user.service";
import {JwtPayload} from "../auth.utils";

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, "jwt") {
  constructor(
    protected configService: ConfigService,
    private userService: UserService
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([(req: Request) => this.getAccessTokenCookie(req)]),
      secretOrKey: configService.get("JWT_SECRET"),
      ignoreExpiration: false
    });
  }

  private getAccessTokenCookie(req: Request) {
    const accessToken = this.configService.get("ACCESS_TOKEN");
    const cookie = req.cookies[accessToken];

    if (!cookie) {
      throw new UnauthorizedException("Invalid access token");
    }

    return cookie;
  }

  async validate({sub: id, email}: JwtPayload) {
    const user = await this.userService.findOneUser({id, email});

    if (!user) {
      throw new UnauthorizedException("User not found");
    }

    return new UserEntity(user);
  }
}
