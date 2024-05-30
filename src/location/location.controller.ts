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
  Query,
  UseGuards
} from "@nestjs/common";
import {UserRole} from "@prisma/client";
import {ApiTags} from "@nestjs/swagger";
import {FindAllEntitiesDto} from "../prisma/prisma.dto";
import {LocationService} from "./location.service";
import {CreateLocationDto, UpdateLocationDto} from "./location.dto";
import {Roles} from "../decorators/roles.deorator";
import {JwtAuthGuard} from "../auth/guards/jwt.guard";
import {RolesGuard} from "../guards/roles.guard";

@ApiTags("Location")
@Controller("location")
export class LocationController {
  constructor(private locationService: LocationService) {}

  @Get()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.MANAGER)
  findAll(@Query() {limit, offset}: FindAllEntitiesDto = {}) {
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
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  async create(@Body() data: CreateLocationDto) {
    try {
      return await this.locationService.createLocation(data);
    } catch (e) {
      console.error(e.message);
      throw new BadRequestException("Failed to create location.");
    }
  }

  @Patch(":id")
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  async update(@Param("id", ParseIntPipe) id: number, @Body() data: UpdateLocationDto) {
    try {
      return await this.locationService.updateLocation(id, data);
    } catch (e) {
      console.error(e.message);
      throw new BadRequestException("Failed to update location.");
    }
  }

  @Delete(":id")
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  async delete(@Param("id", ParseIntPipe) id: number) {
    try {
      return await this.locationService.deleteLocation(id);
    } catch (e) {
      console.error(e.message);
      throw new BadRequestException("Failed to delete location.");
    }
  }
}
