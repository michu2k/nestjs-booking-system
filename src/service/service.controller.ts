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
import {LocationService} from "../location/location.service";
import {FindAllEntitiesDto} from "../prisma/prisma.dto";
import {ServiceService} from "./service.service";
import {CreateServiceDto, UpdateServiceDto} from "./service.dto";

@Controller("service")
export class ServiceController {
  constructor(
    private serviceService: ServiceService,
    private locationService: LocationService
  ) {}

  @Get()
  findAll(@Query() {limit, offset}: FindAllEntitiesDto) {
    return this.serviceService.findAllServices(limit, offset);
  }

  @Get(":id")
  async findOne(@Param("id", ParseIntPipe) id: number) {
    const service = await this.serviceService.findOneService(id);

    if (!service) {
      throw new NotFoundException("Service not found.");
    }

    return service;
  }

  @Post()
  async create(@Body() {locationId, ...serviceData}: CreateServiceDto) {
    const location = await this.locationService.findOneLocation(locationId);

    if (!location) {
      throw new NotFoundException("Location not found.");
    }

    try {
      return await this.serviceService.createService({locationId, ...serviceData});
    } catch (e) {
      console.error(e.message);
      throw new BadRequestException("Failed to create service.");
    }
  }

  @Patch(":id")
  async update(@Param("id", ParseIntPipe) id: number, @Body() {locationId, ...serviceData}: UpdateServiceDto) {
    if (locationId) {
      const location = await this.locationService.findOneLocation(locationId);

      if (!location) {
        throw new NotFoundException("Location not found.");
      }
    }

    try {
      return await this.serviceService.updateService(id, {locationId, ...serviceData});
    } catch (e) {
      console.error(e.message);
      throw new BadRequestException("Failed to update service.");
    }
  }

  @Delete(":id")
  async delete(@Param("id", ParseIntPipe) id: number) {
    try {
      return await this.serviceService.deleteService(id);
    } catch (e) {
      console.error(e.message);
      throw new BadRequestException("Failed to delete service.");
    }
  }
}
