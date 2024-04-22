import {BadRequestException, Injectable, NotFoundException} from "@nestjs/common";
import {Prisma} from "@prisma/client";
import {PrismaService} from "../prisma/prisma.service";

@Injectable()
export class ServiceService {
  constructor(private prisma: PrismaService) {}

  findAllServices(limit?: number, offset?: number) {
    return this.prisma.service.findMany({
      take: limit,
      skip: offset
    });
  }

  async findOneService(id: number) {
    return this.prisma.service
      .findUniqueOrThrow({
        where: {id}
      })
      .catch(() => {
        throw new NotFoundException("Service not found.");
      });
  }

  async createService(data: Prisma.ServiceCreateInput) {
    return this.prisma.service.create({data}).catch((e) => {
      console.error(e.message);
      throw new BadRequestException("Failed to create service.");
    });
  }

  async updateService(id: number, data: Prisma.ServiceUpdateInput) {
    return this.prisma.service
      .update({
        where: {id},
        data
      })
      .catch((e) => {
        console.error(e.message);
        throw new BadRequestException("Failed to update service.");
      });
  }

  async deleteService(id: number) {
    return this.prisma.service
      .delete({
        where: {id}
      })
      .catch((e) => {
        console.error(e.message);
        throw new BadRequestException("Failed to delete service.");
      });
  }
}
