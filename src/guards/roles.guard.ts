import {Injectable, CanActivate, ExecutionContext} from "@nestjs/common";
import {Reflector} from "@nestjs/core";
import {UserRole} from "@prisma/client";
import {UserEntity} from "../user/user.dto";
import {ROLES_KEY} from "../decorators/roles.deorator";

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

    const req = context.switchToHttp().getRequest();
    const user: UserEntity = req.user;

    return roles.some((role) => user.role === role);
  }
}
