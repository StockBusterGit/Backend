import { SetMetadata } from '@nestjs/common';
import { Role } from '../enums/role.enum';

/**
 * Décorateur pour assigner des rôles aux routes.
 */
export const Roles = (...roles: Role[]) => SetMetadata('roles', roles);
