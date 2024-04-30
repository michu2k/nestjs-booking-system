import {Injectable} from "@nestjs/common";
import {PrismaService} from "../prisma/prisma.service";

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}

  async findOneUser(id: number) {
    return this.prisma.user.findUnique({
      where: {id},
      omit: {
        password: true
      }
    });
  }

  async deleteUserAccount(id: number) {
    return this.prisma.user.delete({
      where: {id},
      omit: {
        password: true
      }
    });
  }
}
