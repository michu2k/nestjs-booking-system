import {Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post, Query} from "@nestjs/common";
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
  findOne(@Param("id", ParseIntPipe) id: number) {
    return this.serviceService.findOneService(id);
  }

  @Post()
  async create(@Body() {locationId, ...serviceData}: CreateServiceDto) {
    await this.locationService.findOneLocation(locationId);
    return this.serviceService.createService({locationId, ...serviceData});
  }

  @Patch(":id")
  async update(@Param("id", ParseIntPipe) id: number, @Body() {locationId, ...serviceData}: UpdateServiceDto) {
    if (locationId) {
      await this.locationService.findOneLocation(locationId);
      return this.serviceService.updateService(id, {...serviceData, locationId});
    }

    return this.serviceService.updateService(id, serviceData);
  }

  @Delete(":id")
  delete(@Param("id", ParseIntPipe) id: number) {
    return this.serviceService.deleteService(id);
  }
}
