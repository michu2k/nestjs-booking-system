import {
  BadRequestException,
  Body,
  ClassSerializerInterceptor,
  Controller,
  Delete,
  Get,
  NotFoundException,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
  UseGuards,
  UseInterceptors
} from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";
import { UserRole } from "@prisma/client";

import { JwtAuthGuard } from "../auth/guards/jwt.guard";
import { Roles } from "../decorators/roles.decorator";
import { DeleteEntityResponse } from "../dtos/response.dto";
import { RolesGuard } from "../guards/roles.guard";
import { FindAllEntitiesDto } from "../prisma/prisma.dto";
import { getErrorMessage } from "../utils/get-error-message";
import { CreateLocationDto, LocationEntity, UpdateLocationDto } from "./location.dto";
import { LocationService } from "./location.service";

@ApiTags("Location")
@Controller("location")
@UseInterceptors(ClassSerializerInterceptor)
export class LocationController {
  constructor(private locationService: LocationService) {}

  /**
   * Get a list of locations
   */
  @Get()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.MANAGER)
  async findAll(@Query() { limit, offset }: FindAllEntitiesDto = {}) {
    const locations = await this.locationService.findAllLocations(limit, offset);
    return locations.map((location) => new LocationEntity(location));
  }

  /**
   * Get a location with the specified id
   */
  @Get(":id")
  async findOne(@Param("id", ParseIntPipe) id: number) {
    const location = await this.locationService.findOneLocation(id);

    if (!location) {
      throw new NotFoundException("Location not found.");
    }

    return new LocationEntity(location);
  }

  /**
   * Create a new location
   */
  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.MANAGER)
  async create(@Body() data: CreateLocationDto) {
    try {
      return new LocationEntity(await this.locationService.createLocation(data));
    } catch (e) {
      console.error(getErrorMessage(e));
      throw new BadRequestException("Failed to create location.");
    }
  }

  /**
   * Update a location with the specified id
   */
  @Patch(":id")
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.MANAGER)
  async update(@Param("id", ParseIntPipe) id: number, @Body() data: UpdateLocationDto) {
    try {
      return new LocationEntity(await this.locationService.updateLocation(id, data));
    } catch (e) {
      console.error(getErrorMessage(e));
      throw new BadRequestException("Failed to update location.");
    }
  }

  /**
   * Delete a location with the specified id
   */
  @Delete(":id")
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.MANAGER)
  async delete(@Param("id", ParseIntPipe) id: number) {
    try {
      return new DeleteEntityResponse(await this.locationService.deleteLocation(id));
    } catch (e) {
      console.error(getErrorMessage(e));
      throw new BadRequestException("Failed to delete location.");
    }
  }
}
