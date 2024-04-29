import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  NotFoundException,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query
} from "@nestjs/common";
import {FindAllEntitiesDto} from "../prisma/prisma.dto";
import {LocationService} from "./location.service";
import {CreateLocationDto, UpdateLocationDto} from "./location.dto";

@Controller("location")
export class LocationController {
  constructor(private locationService: LocationService) {}

  @Get()
  findAll(@Query() {limit, offset}: FindAllEntitiesDto) {
    return this.locationService.findAllLocations(limit, offset);
  }

  @Get(":id")
  async findOne(@Param("id", ParseIntPipe) id: number) {
    const location = await this.locationService.findOneLocation(id);

    if (!location) {
      throw new NotFoundException("Location not found.");
    }

    return location;
  }

  @Post()
  async create(@Body() data: CreateLocationDto) {
    try {
      return await this.locationService.createLocation(data);
    } catch (error) {
      console.error(error.message);
      throw new BadRequestException("Failed to create location.");
    }
  }

  @Patch(":id")
  async update(@Param("id", ParseIntPipe) id: number, @Body() data: UpdateLocationDto) {
    try {
      return await this.locationService.updateLocation(id, data);
    } catch (error) {
      console.error(error.message);
      throw new BadRequestException("Failed to update location.");
    }
  }

  @Delete(":id")
  async delete(@Param("id", ParseIntPipe) id: number) {
    try {
      return await this.locationService.deleteLocation(id);
    } catch (error) {
      console.error(error.message);
      throw new BadRequestException("Failed to delete location.");
    }
  }
}
