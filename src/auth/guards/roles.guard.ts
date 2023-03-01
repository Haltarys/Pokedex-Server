import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Role } from 'src/user/enums/role.enum';
import { UserDocument } from 'src/user/user.schema';
import { ROLES_KEY } from '../decorators/roles.decorator';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<Role[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (!requiredRoles) return true;

    let user: UserDocument;
    const type = context.getType();
    if (type === 'ws') {
      user = context.switchToWs().getClient().handshake.user;
    } else {
      user = context.switchToHttp().getRequest().user;
    }
    return user && requiredRoles.includes(user.role);
  }
}
