import {BadRequestException, Injectable, UnauthorizedException} from "@nestjs/common";
import {ConfigService} from "@nestjs/config";
import {JwtService} from "@nestjs/jwt";
import * as bcrypt from "bcrypt";
import {Profile} from "passport-google-oauth20";

import {PrismaService} from "../prisma/prisma.service";
import {UserEntity} from "../user/user.dto";
import {UserService} from "../user/user.service";
import {getErrorMessage} from "../utils/getErrorMessage";
import {JwtPayload} from "./auth.utils";

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
    private userService: UserService,
    protected configService: ConfigService
  ) {}

  /**
   * Check if the user account exists in the database
   */
  async checkIfProviderAccountExists(userId: number, {id, provider}: Profile) {
    return this.prisma.account.findFirst({
      where: {
        userId,
        provider,
        providerAccountId: id
      }
    });
  }

  /**
   * Generate JWT tokens for the user
   */
  async generateAuthTokens({id, email}: UserEntity) {
    const payload: JwtPayload = {sub: id, email};

    const accessToken = await this.jwtService.signAsync(payload, {
      expiresIn: this.configService.get("ACCESS_TOKEN_VALIDITY")
    });

    const refreshToken = await this.jwtService.signAsync(payload, {
      expiresIn: this.configService.get("REFRESH_TOKEN_VALIDITY")
    });

    const hashedRefreshToken = await bcrypt.hash(refreshToken, 10);

    try {
      await this.userService.updateUserRefreshToken(id, hashedRefreshToken);

      return {
        accessToken,
        refreshToken
      };
    } catch (e) {
      console.error(getErrorMessage(e));
      throw new BadRequestException("Failed to update user's token");
    }
  }

  /**
   * Refresh authorization tokens by comparing the cookie token and the user's token
   */
  async refreshAuthTokens(user: UserEntity, refreshToken: string) {
    const isTokenMatched = await bcrypt.compare(refreshToken, user.refreshToken);

    if (!isTokenMatched) {
      throw new UnauthorizedException("Invalid refresh token");
    }

    const authTokens = await this.generateAuthTokens(user);

    return authTokens;
  }
}
