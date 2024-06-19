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
  async findAll(@Query() {limit, offset}: FindAllEntitiesDto = {}) {
    const services = await this.serviceService.findAllServices(limit, offset);
    return services.map((service) => new ServiceEntity(service));
  }

  /**
   * Get a service with the specified `id`
   */
  @Get(":id")
  async findOne(@Param("id", ParseIntPipe) id: number) {
    const service = await this.serviceService.findOneService(id);

    if (!service) {
      throw new NotFoundException("Service not found.");
    }

    return new ServiceEntity(service);
  }

  /**
   * Create a new service
   */
  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  async create(@Body() data: CreateServiceDto) {
    try {
      return new ServiceEntity(await this.serviceService.createService(data));
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
  async update(@Param("id", ParseIntPipe) id: number, @Body() data: UpdateServiceDto) {
    try {
      return new ServiceEntity(await this.serviceService.updateService(id, data));
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
  async delete(@Param("id", ParseIntPipe) id: number) {
    try {
      return new DeleteEntityResponse(await this.serviceService.deleteService(id));
    } catch (e) {
      console.error(e.message);
      throw new BadRequestException("Failed to delete service.");
    }
  }
}
