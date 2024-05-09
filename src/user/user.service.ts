import {Injectable} from "@nestjs/common";
import {Prisma} from "@prisma/client";
import {PrismaService} from "../prisma/prisma.service";
import {AccountEntity, CreateAccountDto, CreateUserDto, UserEntity} from "./user.dto";

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}

  async findOneUser(where: Prisma.UserWhereUniqueInput): Promise<UserEntity> {
    return this.prisma.user.findUnique({
      where
    });
  }

  async createUserAccount({account, ...data}: CreateUserDto): Promise<UserEntity> {
    return this.prisma.user.create({
      data: {
        ...data,
        accounts: {
          create: account
        }
      }
    });
  }

  async createSSOProviderAccount({provider, providerAccountId, userId}: CreateAccountDto): Promise<AccountEntity> {
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

  async deleteUserAccount(id: number): Promise<UserEntity> {
    return this.prisma.user.delete({
      where: {id}
    });
  }
}
