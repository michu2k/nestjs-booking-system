import { SetMetadata } from "@nestjs/common";
import { UserRole } from "@prisma/client";

export const ROLES_KEY = "roles";

/**
 * Decorator that specifies the roles that are allowed to access a route.
 */
export const Roles = (...roles: Array<UserRole>) => SetMetadata(ROLES_KEY, roles);
