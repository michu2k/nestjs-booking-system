import { Injectable } from "@nestjs/common";

import { Prisma } from "../prisma/generated/client";
import { PrismaService } from "../prisma/prisma.service";
import { CreateAccountDto, CreateUserDto } from "./user.dto";

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}

  async findOneUser(where: Prisma.UserWhereUniqueInput) {
    return this.prisma.user.findUnique({
      where
    });
  }

  async createUserAccount({ account, ...data }: CreateUserDto) {
    return this.prisma.user.create({
      data: {
        ...data,
        accounts: {
          create: account
        }
      }
    });
  }

  async createSSOProviderAccount({ provider, providerAccountId, userId }: CreateAccountDto) {
    return this.prisma.account.create({
      data: {
        provider,
        providerAccountId,
        user: {
          connect: {
            id: userId
          }
        }
      }
    });
  }

  async deleteUserAccount(id: number) {
    return this.prisma.user.delete({
      where: { id },
      select: {
        id: true
      }
    });
  }

  /**
   * Update the user's refresh token
   */
  async updateUserRefreshToken(userId: number, refreshToken: string) {
    return this.prisma.user.update({
      where: { id: userId },
      data: {
        refreshToken
      }
    });
  }
}
