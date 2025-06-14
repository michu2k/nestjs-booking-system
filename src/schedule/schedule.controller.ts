import {
  BadRequestException,
  Body,
  ClassSerializerInterceptor,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  UseGuards,
  UseInterceptors
} from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";
import { UserRole } from "@prisma/client";

import { JwtAuthGuard } from "../auth/guards/jwt.guard";
import { Roles } from "../decorators/roles.decorator";
import { RolesGuard } from "../guards/roles.guard";
import { getErrorMessage } from "../utils/get-error-message";
import { ScheduleEntity, UpdateScheduleDto } from "./schedule.dto";
import { ScheduleService } from "./schedule.service";

@ApiTags("Schedule")
@Controller("schedule")
@UseInterceptors(ClassSerializerInterceptor)
export class ScheduleController {
  constructor(private readonly scheduleService: ScheduleService) {}

  /**
   * Get a schedule for a service with the specified id
   */
  @Get()
  async findAll(@Param("serviceId", ParseIntPipe) serviceId: number) {
    const schedule = await this.scheduleService.findSchedule({ serviceId });
    return schedule.map((s) => new ScheduleEntity(s));
  }

  /**
   * Update a schedule with the specified id
   */
  @Patch(":id")
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.MANAGER)
  async update(@Param("id", ParseIntPipe) id: number, @Body() data: UpdateScheduleDto) {
    try {
      return new ScheduleEntity(await this.scheduleService.updateSchedule(id, data));
    } catch (e) {
      console.error(getErrorMessage(e));
      throw new BadRequestException("Failed to update schedule.");
    }
  }
}
