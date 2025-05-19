import { CanActivate, ExecutionContext, Injectable } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { UserRole } from "@prisma/client";
import { Request } from "express";

import { ROLES_KEY } from "../decorators/roles.deorator";
import { UserEntity } from "../user/user.dto";

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const roles = this.reflector.getAllAndOverride<Array<UserRole>>(ROLES_KEY, [
      context.getHandler(),
      context.getClass()
    ]);

    if (!roles) {
      return true;
    }

    const req = context.switchToHttp().getRequest<Request>();
    const user = req.user as UserEntity;

    return roles.some((role) => user.role === role);
  }
}
