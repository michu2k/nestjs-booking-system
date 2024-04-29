import {BadRequestException, Controller, Delete, Get, NotFoundException, Param, ParseIntPipe} from "@nestjs/common";
import {UserService} from "./user.service";

@Controller("user")
export class UserController {
  constructor(private userService: UserService) {}

  @Get(":id")
  async findOne(@Param("id", ParseIntPipe) id: number) {
    const user = await this.userService.findOneUser(id);

    if (!user) {
      throw new NotFoundException("User not found.");
    }

    return user;
  }

  @Delete(":id")
  async delete(@Param("id", ParseIntPipe) id: number) {
    try {
      return await this.userService.deleteUserAccount(id);
    } catch (error) {
      console.error(error.message);
      throw new BadRequestException("Failed to delete account");
    }
  }
}
