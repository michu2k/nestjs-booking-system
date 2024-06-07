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
import {ApiTags} from "@nestjs/swagger";
import {FindAllEntitiesDto} from "../prisma/prisma.dto";
import {ServiceService} from "./service.service";
import {CreateServiceDto, ServiceEntity, UpdateServiceDto} from "./service.dto";
import {JwtAuthGuard} from "../auth/guards/jwt.guard";
import {RolesGuard} from "../guards/roles.guard";
import {Roles} from "../decorators/roles.deorator";
import {UserRole} from "@prisma/client";
import {DeleteEntityResponse} from "../dtos/response.dto";

@ApiTags("Service")
@Controller("service")
export class ServiceController {
  constructor(private serviceService: ServiceService) {}

  /**
   * Get a list of services
   */
  @Get()
  findAll(@Query() {limit, offset}: FindAllEntitiesDto = {}): Promise<Array<ServiceEntity>> {
    return this.serviceService.findAllServices(limit, offset);
  }

  /**
   * Get a service with the specified `id`
   */
  @Get(":id")
  async findOne(@Param("id", ParseIntPipe) id: number): Promise<ServiceEntity> {
    const service = await this.serviceService.findOneService(id);

    if (!service) {
      throw new NotFoundException("Service not found.");
    }

    return service;
  }

  /**
   * Create a new service
   */
  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  async create(@Body() data: CreateServiceDto): Promise<ServiceEntity> {
    try {
      return await this.serviceService.createService(data);
    } catch (e) {
      console.error(e.message);
      throw new BadRequestException("Failed to create service.");
    }
  }

  /**
   * Update a service with the specified `id`
   */
  @Patch(":id")
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  async update(@Param("id", ParseIntPipe) id: number, @Body() data: UpdateServiceDto): Promise<ServiceEntity> {
    try {
      return await this.serviceService.updateService(id, data);
    } catch (e) {
      console.error(e.message);
      throw new BadRequestException("Failed to update service.");
    }
  }

  /**
   * Delete a service with the specified `id`
   */
  @Delete(":id")
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  async delete(@Param("id", ParseIntPipe) id: number): Promise<DeleteEntityResponse> {
    try {
      return await this.serviceService.deleteService(id);
    } catch (e) {
      console.error(e.message);
      throw new BadRequestException("Failed to delete service.");
    }
  }
}
