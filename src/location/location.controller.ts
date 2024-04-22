import {Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post, Query} from "@nestjs/common";
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
  findOne(@Param("id", ParseIntPipe) id: number) {
    return this.locationService.findOneLocation(id);
  }

  @Post()
  create(@Body() data: CreateLocationDto) {
    return this.locationService.createLocation(data);
  }

  @Patch(":id")
  update(@Param("id", ParseIntPipe) id: number, @Body() data: UpdateLocationDto) {
    return this.locationService.updateLocation(id, data);
  }

  @Delete(":id")
  delete(@Param("id", ParseIntPipe) id: number) {
    return this.locationService.deleteLocation(id);
  }
}
