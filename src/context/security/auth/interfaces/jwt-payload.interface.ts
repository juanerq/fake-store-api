import { ModulePermissions } from '../../roles/dto/module-permissions.dto';

export interface JwtPayload {
  id: number;
  roles: ModulePermissions[];
}
