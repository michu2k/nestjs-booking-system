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
import {CreateServiceDto, UpdateServiceDto} from "./service.dto";
import {JwtAuthGuard} from "../auth/guards/jwt.guard";
import {RolesGuard} from "../guards/roles.guard";
import {Roles} from "../decorators/roles.deorator";
import {UserRole} from "@prisma/client";

@ApiTags("Service")
@Controller("service")
export class ServiceController {
  constructor(private serviceService: ServiceService) {}

  @Get()
  findAll(@Query() {limit, offset}: FindAllEntitiesDto = {}) {
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
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  async create(@Body() data: CreateServiceDto) {
    try {
      return await this.serviceService.createService(data);
    } catch (e) {
      console.error(e.message);
      throw new BadRequestException("Failed to create service.");
    }
  }

  @Patch(":id")
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.MANAGER)
  async update(@Param("id", ParseIntPipe) id: number, @Body() data: UpdateServiceDto) {
    try {
      return await this.serviceService.updateService(id, data);
    } catch (e) {
      console.error(e.message);
      throw new BadRequestException("Failed to update service.");
    }
  }

  @Delete(":id")
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  async delete(@Param("id", ParseIntPipe) id: number) {
    try {
      return await this.serviceService.deleteService(id);
    } catch (e) {
      console.error(e.message);
      throw new BadRequestException("Failed to delete service.");
    }
  }
}
