import {Injectable} from "@nestjs/common";
import {Profile} from "passport-google-oauth20";
import {JwtService} from "@nestjs/jwt";
import {PrismaService} from "../prisma/prisma.service";
import {UserEntity} from "../user/user.dto";
import {JwtPayload} from "./strategies/jwt.strategy";

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService
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
   * Generate JWT token for the user
   */
  async generateAccessToken({id, email}: UserEntity) {
    const payload: JwtPayload = {sub: id, email};
    return await this.jwtService.signAsync(payload);
  }
}
