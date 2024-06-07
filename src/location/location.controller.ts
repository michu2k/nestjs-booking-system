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
import {CreateLocationDto, LocationEntity, UpdateLocationDto} from "./location.dto";
import {Roles} from "../decorators/roles.deorator";
import {JwtAuthGuard} from "../auth/guards/jwt.guard";
import {RolesGuard} from "../guards/roles.guard";
import {DeleteEntityResponse} from "../dtos/response.dto";

@ApiTags("Location")
@Controller("location")
export class LocationController {
  constructor(private locationService: LocationService) {}

  /**
   * Get a list of locations
   */
  @Get()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.MANAGER)
  findAll(@Query() {limit, offset}: FindAllEntitiesDto = {}): Promise<Array<LocationEntity>> {
    return this.locationService.findAllLocations(limit, offset);
  }

  /**
   * Get a location with the specified `id`
   */
  @Get(":id")
  async findOne(@Param("id", ParseIntPipe) id: number): Promise<LocationEntity> {
    const location = await this.locationService.findOneLocation(id);

    if (!location) {
      throw new NotFoundException("Location not found.");
    }

    return location;
  }

  /**
   * Create a new location
   */
  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.MANAGER)
  async create(@Body() data: CreateLocationDto): Promise<LocationEntity> {
    try {
      return await this.locationService.createLocation(data);
    } catch (e) {
      console.error(e.message);
      throw new BadRequestException("Failed to create location.");
    }
  }

  /**
   * Update a location with the specified `id`
   */
  @Patch(":id")
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.MANAGER)
  async update(@Param("id", ParseIntPipe) id: number, @Body() data: UpdateLocationDto): Promise<LocationEntity> {
    try {
      return await this.locationService.updateLocation(id, data);
    } catch (e) {
      console.error(e.message);
      throw new BadRequestException("Failed to update location.");
    }
  }

  /**
   * Delete a location with the specified `id`
   */
  @Delete(":id")
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.MANAGER)
  async delete(@Param("id", ParseIntPipe) id: number): Promise<DeleteEntityResponse> {
    try {
      return await this.locationService.deleteLocation(id);
    } catch (e) {
      console.error(e.message);
      throw new BadRequestException("Failed to delete location.");
    }
  }
}
