import {Injectable} from "@nestjs/common";
import {Profile} from "passport-google-oauth20";
import {ConfigService} from "@nestjs/config";
import {JwtService} from "@nestjs/jwt";
import {PrismaService} from "../prisma/prisma.service";
import {UserEntity} from "../user/user.dto";
import {UserService} from "../user/user.service";

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

    await this.userService.updateUserRefreshToken(id, hashedRefreshToken);

    return {
      accessToken,
      refreshToken
    };
  }
}
