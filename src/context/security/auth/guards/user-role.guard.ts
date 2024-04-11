import {
  BadRequestException,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Observable } from 'rxjs';
import { META_ROLES } from '../decorators';
import { ValidModule } from '../interfaces';
import { User } from 'src/context/users/entities';
import { ModulePermissions } from '../../roles/dto/module-permissions.dto';
import { PermissionTypes } from '../../permissions/enums/permission-types.enum';

@Injectable()
export class UserRoleGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const validModule: ValidModule = this.reflector.getAllAndMerge(META_ROLES, [
      context.getHandler(),
      context.getClass(),
    ]);

    const req = context.switchToHttp().getRequest();

    const { user, roles } = req.user as {
      user: User;
      roles: ModulePermissions[];
    };

    if (!user) throw new BadRequestException('User not found');

    const { method } = req;

    if (!validModule) {
      const module = req.url.split('/')[1];
      validModule.moduleName = module;
    }
    const { moduleName } = validModule;

    const validPermissions = this.checkRolePermissions(roles, {
      moduleName,
      method: method.toUpperCase(),
    });

    if (validPermissions) return true;

    throw new ForbiddenException(
      `User ${user.fullName} is not allowed to make the ${method.toUpperCase()} request in the [${validModule.moduleName}] module.`,
    );
  }

  private checkRolePermissions(
    rolePermissions: ModulePermissions[],
    routePermissions: { moduleName: string; method: string },
  ): boolean {
    const { moduleName, method } = routePermissions;

    for (const role of rolePermissions) {
      for (const { module, permissions } of role.modulePermissions) {
        if (
          module.detail === moduleName ||
          module.detail === PermissionTypes.ALL.toLowerCase()
        ) {
          for (const permission of permissions) {
            if (
              permission.type === method ||
              permission.type === PermissionTypes.ALL
            )
              return true;
          }
        }
      }
    }

    return false;
  }
}
