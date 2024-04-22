import {BadRequestException, Injectable, NotFoundException} from "@nestjs/common";
import {PrismaService} from "../prisma/prisma.service";
import {CreateLocationDto, UpdateLocationDto} from "./location.dto";

@Injectable()
export class LocationService {
  constructor(private prisma: PrismaService) {}

  async findAllLocations(limit?: number, offset?: number) {
    return this.prisma.service.findMany({
      take: limit,
      skip: offset
    });
  }

  async findOneLocation(id: number) {
    return this.prisma.location
      .findUniqueOrThrow({
        where: {id}
      })
      .catch(() => {
        throw new NotFoundException("Location not found.");
      });
  }

  async createLocation(data: CreateLocationDto) {
    return this.prisma.location.create({data}).catch((e) => {
      console.error(e.message);
      throw new BadRequestException("Failed to create location.");
    });
  }

  async updateLocation(id: number, data: UpdateLocationDto) {
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
