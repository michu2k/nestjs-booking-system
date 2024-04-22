import {BadRequestException, Injectable, NotFoundException} from "@nestjs/common";
import {PrismaService} from "../prisma/prisma.service";
import {CreateServiceDto, UpdateServiceDto} from "./service.dto";

@Injectable()
export class ServiceService {
  constructor(private prisma: PrismaService) {}

  async findAllServices(limit?: number, offset?: number) {
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

  async createService(data: CreateServiceDto) {
    return this.prisma.service.create({data}).catch((e) => {
      console.error(e.message);
      throw new BadRequestException("Failed to create service.");
    });
  }

  async updateService(id: number, data: UpdateServiceDto) {
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
