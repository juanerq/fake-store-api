import { ModulePermissions } from '../../roles/interfaces/module-permissions.interface';

export interface JwtPayload {
  id: number;
  roles: ModulePermissions[];
}
