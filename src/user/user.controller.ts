import {
  BadRequestException,
  Controller,
  Delete,
  Get,
  NotFoundException,
  Param,
  ParseIntPipe,
  UseGuards
} from "@nestjs/common";
import {UserService} from "./user.service";
import {JwtAuthGuard} from "../auth/guards/jwt.guard";

// TODO: Implement IsMeGuard
@UseGuards(JwtAuthGuard)
@Controller("user")
export class UserController {
  constructor(private userService: UserService) {}

  @Get(":id")
  async findOne(@Param("id", ParseIntPipe) id: number) {
    const user = await this.userService.findOneUser({id});

    if (!user) {
      throw new NotFoundException("User not found.");
    }

    return user;
  }

  @Delete(":id")
  async delete(@Param("id", ParseIntPipe) id: number) {
    try {
      return await this.userService.deleteUserAccount(id);
    } catch (e) {
      console.error(e.message);
      throw new BadRequestException("Failed to delete account");
    }
  }
}
