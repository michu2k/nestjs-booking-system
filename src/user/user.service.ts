import {BadRequestException, Injectable, NotFoundException} from "@nestjs/common";
import {PrismaService} from "../prisma/prisma.service";

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}

  async findOneUser(id: number) {
    return this.prisma.user
      .findUniqueOrThrow({
        where: {id}
      })
      .then((user) => {
        const excludeFields = ["password"];
        return Object.fromEntries(Object.entries(user).filter(([key]) => !excludeFields.includes(key)));
      })
      .catch(() => {
        throw new NotFoundException("User not found.");
      });
  }

  async deleteUserAccount(id: number) {
    return this.prisma.user
      .delete({
        where: {id}
      })
      .catch((e) => {
        console.error(e.message);
        throw new BadRequestException("Failed to delete account.");
      });
  }
}
