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
import { CreateServiceDto, ServiceEntity, UpdateServiceDto } from "./service.dto";
import { ServiceService } from "./service.service";

@ApiTags("Service")
@Controller("service")
@UseInterceptors(ClassSerializerInterceptor)
export class ServiceController {
  constructor(private serviceService: ServiceService) {}

  /**
   * Get a list of services
   */
  @Get()
  async findAll(@Query() { limit, offset }: FindAllEntitiesDto = {}) {
    const services = await this.serviceService.findAllServices(limit, offset);
    return services.map((service) => new ServiceEntity(service));
  }

  /**
   * Get a service with the specified id
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
      console.error(getErrorMessage(e));
      throw new BadRequestException("Failed to create service.");
    }
  }

  /**
   * Update a service with the specified id
   */
  @Patch(":id")
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  async update(@Param("id", ParseIntPipe) id: number, @Body() data: UpdateServiceDto) {
    try {
      return new ServiceEntity(await this.serviceService.updateService(id, data));
    } catch (e) {
      console.error(getErrorMessage(e));
      throw new BadRequestException("Failed to update service.");
    }
  }

  /**
   * Delete a service with the specified id
   */
  @Delete(":id")
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  async delete(@Param("id", ParseIntPipe) id: number) {
    try {
      return new DeleteEntityResponse(await this.serviceService.deleteService(id));
    } catch (e) {
      console.error(getErrorMessage(e));
      throw new BadRequestException("Failed to delete service.");
    }
  }
}
