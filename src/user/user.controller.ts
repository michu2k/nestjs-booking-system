import {
  BadRequestException,
  ClassSerializerInterceptor,
  Controller,
  Delete,
  ForbiddenException,
  Get,
  NotFoundException,
  Param,
  ParseIntPipe,
  UseGuards,
  UseInterceptors
} from "@nestjs/common";
import {ApiTags} from "@nestjs/swagger";

import {JwtAuthGuard} from "../auth/guards/jwt.guard";
import {User} from "../decorators/user.decorator";
import {DeleteEntityResponse} from "../dtos/response.dto";
import {UserEntity} from "./user.dto";
import {UserService} from "./user.service";

@UseGuards(JwtAuthGuard)
@ApiTags("User")
@Controller("user")
@UseInterceptors(ClassSerializerInterceptor)
export class UserController {
  constructor(private userService: UserService) {}

  /**
   * Get a user
   */
  @Get(":id")
  async findOne(@Param("id", ParseIntPipe) id: number, @User() user: UserEntity) {
    if (user.id !== id) {
      throw new ForbiddenException("You are not allowed to perform this operation");
    }

    const dbUser = await this.userService.findOneUser({id});

    if (!dbUser) {
      throw new NotFoundException("User not found.");
    }

    return new UserEntity(dbUser);
  }

  /**
   * Delete a user
   */
  @Delete(":id")
  async delete(@Param("id", ParseIntPipe) id: number, @User() user: UserEntity) {
    if (user.id !== id) {
      throw new ForbiddenException("You are not allowed to perform this operation");
    }

    try {
      return new DeleteEntityResponse(await this.userService.deleteUserAccount(id));
    } catch (e) {
      console.error(e.message);
      throw new BadRequestException("Failed to delete account");
    }
  }
}
