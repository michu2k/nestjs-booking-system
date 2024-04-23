import {Controller, Delete, Get, Param, ParseIntPipe} from "@nestjs/common";
import {UserService} from "./user.service";

@Controller("user")
export class UserController {
  constructor(private userService: UserService) {}

  @Get(":id")
  findOne(@Param("id", ParseIntPipe) id: number) {
    return this.userService.findOneUser(id);
  }

  @Delete(":id")
  delete(@Param("id", ParseIntPipe) id: number) {
    return this.userService.deleteUserAccount(id);
  }
}
