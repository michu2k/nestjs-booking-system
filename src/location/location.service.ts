import {BadRequestException, Injectable, NotFoundException} from "@nestjs/common";
import {PrismaService} from "../prisma/prisma.service";
import {Prisma} from "@prisma/client";

@Injectable()
export class LocationService {
  constructor(private prisma: PrismaService) {}

  async findAllLocations() {
    return this.prisma.location.findMany();
  }

  async findOneLocation(id: number) {
    return this.prisma.location
      .findUniqueOrThrow({
        where: {id}
      })
      .catch(() => {
        throw new BadRequestException("Location not found.");
      });
  }

  async createLocation(data: Prisma.LocationCreateInput) {
    return this.prisma.location.create({data}).catch((e) => {
      console.error(e.message);
      throw new BadRequestException("Failed to create location.");
    });
  }

  async updateLocation(id: number, data: Prisma.LocationUpdateInput) {
    return this.prisma.location
      .update({
        where: {id},
        data
      })
      .catch((e) => {
        console.error(e.message);
        throw new BadRequestException("Failed to update location.");
      });
  }

  async deleteLocation(id: number) {
    return this.prisma.location.delete({where: {id}}).catch((e) => {
      console.error(e.message);
      throw new BadRequestException("Failed to delete location.");
    });
  }
}
