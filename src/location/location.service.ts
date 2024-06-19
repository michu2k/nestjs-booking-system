import {Injectable} from "@nestjs/common";

import {PrismaService} from "../prisma/prisma.service";
import {CreateLocationDto, UpdateLocationDto} from "./location.dto";

@Injectable()
export class LocationService {
  constructor(private prisma: PrismaService) {}

  async findAllLocations(limit?: number, offset?: number) {
    return this.prisma.location.findMany({
      take: limit,
      skip: offset
    });
  }

  async findOneLocation(id: number) {
    return this.prisma.location.findUnique({
      where: {id}
    });
  }

  async createLocation(data: CreateLocationDto) {
    return this.prisma.location.create({data});
  }

  async updateLocation(id: number, data: UpdateLocationDto) {
    return this.prisma.location.update({
      where: {id},
      data
    });
  }

  async deleteLocation(id: number) {
    return this.prisma.location.delete({
      where: {id},
      select: {id: true}
    });
  }
}
